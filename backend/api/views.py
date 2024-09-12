import requests
from .models import TenderAd
import time
import json
from sklearn.metrics.pairwise import cosine_similarity
from django.core.mail import send_mail, EmailMultiAlternatives
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .serializer import ResponseDetailSerializer
from . import serializer
from jinja2 import Environment, FileSystemLoader
from django.shortcuts import HttpResponse
import pdfkit
import re
from bidi.algorithm import get_display
import arabic_reshaper
from num2words import num2words
from word2number import w2n
from .models import ResponsePrivateCondition
from .models import TenderPublicConditions
from .models import Supplier
from .models import ResponseProductBid
from .models import TenderProduct
from .models import Owner
from .models import TenderAdmin
import numpy as np
from django.utils.html import strip_tags
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import authentication_classes
from django.http import JsonResponse
from .tokens import account_activation_token
from django.contrib import messages
from django.core.mail import EmailMessage
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from .forms import CustomUserForm
from django.shortcuts import render
from .models import TenderPrivateConditions,CustomUser, Company, UserNotification, Tender, TenderResponse, Transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializer import TransactionSerializer, UserSerializer, CompanySerializer, NotificationnSerializer, TenderSerializer, ResponseSerializer
from rest_framework import generics, status, serializers
from rest_framework.views import APIView
from tasks.tasks import activate_account
from joblib import load
import torch
from django.utils.formats import date_format
from django.utils import translation
from django.db import transaction
from . import utils
from tasks.tasks import compute_similarity

class CompanyRegisterationView(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        response_id = request.query_params.get("response_id")
        tender_id = request.query_params.get("tender_id")
        if response_id:
            user = TenderResponse.objects.get(id=response_id).user
            company = Company.objects.get(user=user)
            serialized_data = CompanySerializer(company).data
            return Response(serialized_data)
        elif tender_id:
            user = Tender.objects.get(id=tender_id).user
            company = Company.objects.get(user=user)
            serialized_data = CompanySerializer(company).data
            return Response(serialized_data)

    def post(self, request, *args, **kwargs):
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            activate_account.delay(user.id)
            return Response({"data": "data has been submitted succesfully"})
        else:
            return Response(serializer.errors)

    def put(self, request, *args, **kwargs):
        email = request.data.get('user').get('email', None)
        if email is None:
            return Response({'error': 'Email is required in the request data.'},
                            status=status.HTTP_400_BAD_REQUEST)
        instance = Company.objects.filter(user__email=email).first()
        serializer = CompanySerializer(instance=instance, data=request.data)
        serializer.update(instance, request.data)
        return Response(CompanySerializer(instance).data)


class TenderView(generics.RetrieveAPIView):
    serializer_class = TenderSerializer
    queryset = Tender.objects.all()
    lookup_field = 'pk'

    def tender_anonmyzation_decision(self, new_status, data, instance):
        anonmyzed_status = ['open', 'pending_decision',
                            'candidate_pool', 'awaiting_confirmation']
        deanonmyzed_status = ['draft', 'template', 'cancelled', 'awarded']
        toggled_data = None
        old_status = instance.status
        if (old_status in anonmyzed_status) & (new_status in deanonmyzed_status):
            tender_data = self.get_serializer(instance).data
            toggled_data = utils.toggle_anonymity(
                tender_data, False, object_type='t', object_id=instance.id)
        elif (old_status in deanonmyzed_status) & (new_status in anonmyzed_status):
            tender_data = self.get_serializer(instance).data
            toggled_data = utils.toggle_anonymity(
                tender_data, True, object_type='t', object_id=instance.id)
        else:
            #same data nothing happens
            toggled_data = data
        if toggled_data is None:
            print("toggled_data in tender_anonmyzation_decision is  NONNNNNEEEE")
        toggled_data['status'] = new_status
        return toggled_data

    def handle_responses(self, instance):
        responses = TenderResponse.objects.filter(tender=instance)
        if instance.status in ['draft', 'cancelled'] and len(responses) > 0:
            UserNotification.objects.create(recipient=instance.user,
                                            message=f"تم ازاله العروض التي كانت مقدمه علي مناقصة \"{instance.ad.title}\" ")
            for response in responses:
                UserNotification.objects.create(recipient=response.user,
                                                message=f"تم ازاله عرضك نظراً لالغاء المناقصة \"{instance.ad.title}\"")
                response.delete()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request)

    def post(self, request, *args, **kwargs):
        saved_instance = Tender.objects.create(
            user=request.user, status=request.data.get('status'))
        tender_data = request.data
        if request.data.get('status') == 'open':
            tender_data = utils.toggle_anonymity(
                tender_data, True, object_type='t', object_id=saved_instance.id)
        serializer_anonymized = self.get_serializer(
            instance=saved_instance,
            data=tender_data,
            context={'request': request}
        )
        if serializer_anonymized.is_valid():
            serializer_anonymized.save()
            return Response(serializer_anonymized.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer_anonymized.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('status')
        toggled_data = self.tender_anonmyzation_decision(
            new_status=new_status, data=request.data, instance=instance)
        serializer_encrpted_version = self.get_serializer(
            instance=instance,
            data=toggled_data,
            context={'request': request})
        if serializer_encrpted_version.is_valid():
            serializer_encrpted_version.save()
            return Response(serializer_encrpted_version.data)
        else:
            return Response(serializer_encrpted_version.errors)

    def patch(self, request, *args, **kwargs):
        new_status = request.data.get('status')
        instance = self.get_object()
        toggled_data = self.tender_anonmyzation_decision(
            new_status=new_status, data=request.data, instance=instance)
        tender_serializer = self.get_serializer(
            data=toggled_data,
            instance=instance,
            partial=True)
        if tender_serializer.is_valid(raise_exception=True):
            tender_serializer.save()
            self.handle_responses(instance)
            return Response(tender_serializer.data)


class ListHostTenders(generics.ListAPIView):
    serializer_class = TenderSerializer

    def get_queryset(self):
        user = self.request.user
        status = self.request.query_params.get('status', None)
        queryset = Tender.objects.filter(user=user).order_by('-date_created')
        queryset = queryset.filter(
            status__in=status.split(',')) if status else queryset
        return queryset


class TenderSupplierView(generics.ListAPIView):
    serializer_class = TenderSerializer

    def get_queryset(self):
        user = self.request.user
        response_status = self.request.query_params.get(
            'response_status', None)
        company = Company.objects.get(user=user)
        queryset = Tender.objects.filter(
            ad__field=company.company_field).exclude(user=user)
        # respnse status will be passed only when tracking the status of the response itself
        # if it's not passed then it means searching for the tenders which are currently open
        if response_status:
            status_list = response_status.split(',')
            return queryset.filter(tenderresponse__status__in=status_list, tenderresponse__user=user)
        # get the tenders that are currently open and exclude the tenders that this supplier published
        return queryset.filter(status='open').exclude(tenderresponse__user=self.request.user)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class ResponseView(APIView):
    def calculate_similarity(self,tender,response_anonmyzed_data,response):
        tender_data=''
        response_data=''
        offer_products_data=response_anonmyzed_data.get('offer_products')
        previous_work_data=response_anonmyzed_data.get('previous_work')
        offer_conditions_data=response_anonmyzed_data.get('offer_conditions')

        for product_data in offer_products_data:
            productid = product_data.pop('productid',None)
            product = TenderProduct.objects.get(id=productid)
            tender_data=tender_data+product.title+"|"+product.description+"|"+product.quantity+"|"
            if product_data.get('supplying_status')!="متوفر":
                response_data=response_data+' '+"|"+' '+"|"+' '+"|"
            else:
                response_data=response_data+product_data.get('product_title')+"|"+product_data.get('product_description')+"|"+str(product_data.get('provided_quantity'))+"|"

        offer_previous_work=[]
        for work in previous_work_data:
            offer_previous_work.append(work.get('title')+"|"+work.get('description')+"|")

        ad=TenderAd.objects.get(tender=tender)
        tender_ad=ad.title+"|"+ad.topic+"|"

        for condition_data in offer_conditions_data:
            print("CONDITONIS",condition_data.get('condition'))
            condition_instance=TenderPrivateConditions.objects.get(id=condition_data.get('condition'))
            tender_data= tender_data +condition_instance.condition+"|"
            response_data = response_data+ condition_data.get('offered_condition') + "|"

        compute_similarity.delay(tender_data,response_data,response.id,offer_previous_work,tender_ad)

    def get(self, request,pk,*args, **kwargs):
        response = TenderResponse.objects.get(
            user=request.user, tender=Tender.objects.get(id=pk))
        serialized_version = ResponseDetailSerializer(response)
        return Response(serialized_version.data)

    def post(self, request, *args, **kwargs):
        tender_instance=Tender.objects.get(id=request.data.get('tender_id'))
        response_instance=TenderResponse.objects.create(
            user=request.user,
            status=request.data.get('status'),
            tender=tender_instance)

        anonymized_data = utils.toggle_anonymity(
            request.data, True, object_type='r', object_id=response_instance.id)
        anonmyized_serializer = ResponseSerializer(
            instance=response_instance,
            data=anonymized_data)
        if anonmyized_serializer.is_valid():
            anonmyized_serializer.save()
            self.calculate_similarity(tender_instance,anonymized_data,response_instance)
            return Response(anonmyized_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(anonmyized_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListResponses(generics.ListAPIView):
    serializer_class = serializer.ResponseDetailSerializer
    def get_queryset(self):
        try:
            user = self.request.user
            tender_id = self.kwargs.get('tender_id', None)
            tender_instance = Tender.objects.get(id=tender_id)
            queryset = TenderResponse.objects.filter(
                tender=tender_instance).order_by('-score')
            status = self.request.query_params.get('status', None)
            queryset=queryset.filter(status__in=status.split(',')) if status else queryset
            return queryset
        except Tender.DoesNotExist:
            return Response({"Message": "Tender not found."}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class CloseCandidatePool(generics.RetrieveUpdateAPIView):
    serializer_class=TenderSerializer
    queryset = Tender.objects.all()
    lookup_field='pk'
    def patch(self, request, *args, **kwargs):
        tender = self.get_object()
        responses = TenderResponse.objects.filter(tender=tender)
        candidate_response_exist = False
        for response in responses:
            if response.status == 'offered':
                response.status = 'rejected'
                response.save()
                UserNotification.objects.create(
                    recipient=response.user,
                    message=f'للأسف لقد تم رفض عرضك لمناقصة "{response.tender.ad.title}"'
                )
            elif response.status == 'candidate_pool':
                candidate_response_exist = True
        if candidate_response_exist:
            tender.status = 'candidate_pool'
            tender.save()
            UserNotification.objects.create(
            recipient=tender.user,
            message=f"لقد تم نقل مناقصة \"{tender.ad.title}\" لمرحلة التقييم المالي"
            )
            return Response({"Message": "candidate_pool"})
        else:
            return self.cancel_tender(tender)
    def cancel_tender(self,tender):
        tender_data = self.get_serializer(tender).data
        toggled_data=utils.toggle_anonymity(tender_data,False,object_type='t',object_id=tender.id)
        toggled_data['status']='cancelled'
        tender_serializer=self.get_serializer(
            data=toggled_data,
            instance=tender,
            partial=True
        )
        if tender_serializer.is_valid():
            tender_serializer.save()
            tender.save()
            UserNotification.objects.create(
                recipient=tender.user,
                message=f'تم الغاء مناقصة \"{tender.ad.title}\" لعدم اختيار عروض لمرحلة التقييم المالي ')
            return Response({"Message": "cancelled"})
        else:
            return Response(tender_serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class UseTemplate(generics.RetrieveAPIView):
    serializer_class=TenderSerializer
    queryset= Tender.objects.filter(status='template')
    lookup_field='pk'
    def post(self,request,pk):
        try:
            tender_instance=self.get_object()
            tender_data=self.get_serializer(tender_instance).data
            tender_data['status']='draft'
            tender_serializer=self.get_serializer(
                data=tender_data,
                context={'request': request}
            )
            if tender_serializer.is_valid(raise_exception=True):
                tender_serializer.save()
                return Response(tender_serializer.data)
        except Tender.DoesNotExist:
            return Response({"Message": "Tender not found."}, status=status.HTTP_404_NOT_FOUND)



class AwardResponse(APIView):
    def patch(self, request,tender_id,response_id):
        tender = Tender.objects.get(id=tender_id)
        response = TenderResponse.objects.get(id=response_id)
        UserNotification.objects.create(
            recipient=tender.user,
            message=f"لقد تم إختيار مورد فائز بمناقصة \"{tender.ad.title}\" \n في إنتظار التأكيد من خلال المورد"
        )
        UserNotification.objects.create(
            recipient=response.user,
            message=f"تهانينا لقد تم اختيار عرضك علي مناقصة \"{tender.ad.title}\" يرجي التأكيد لإستكمال الاجرائات"
        )
        tender.status = "awaiting_confirmation"
        tender.save()
        response.status = "awarded"
        response.save()
        return Response({"Message": "Done"})


class SupplierConfirmation(APIView):
    def deanonmyze_and_save(self,tender,response):
        new_tender_status = 'awarded'
        new_response_status = 'winner'
        UserNotification.objects.create(
            recipient=tender.user,
            message=f"لقد أكد المورد علي قبول مناقصة \"{tender.ad.title}\"")
        tender_data = TenderSerializer(tender).data
        response_data = ResponseSerializer(response).data
        tender_data['status'] = new_tender_status
        response_data['status'] = new_response_status
        de_annomyzed_tender = utils.toggle_anonymity(
            tender_data, False, 't', tender.id)

        de_annomyzed_response = utils.toggle_anonymity(
            response_data, False, 'r', response.id)

        # here the response will be deanonmyzed as a tender 
        # the reason for that is the response might have a text that already 
        # has been anonmyzed in the anonmyzation of the tender itself
        # 'r as t' is handled in the toggle_anonmyzity function itself
        # to make the text deanonmyzed as a tender but not act it as a tender data
        de_annomyzed_response=utils.toggle_anonymity(
            de_annomyzed_response,False,'r as t',tender.id)

        tender_serializer = TenderSerializer(
            instance=tender,
            data=de_annomyzed_tender)

        response_serializer = ResponseSerializer(
            instance=response,
            data=de_annomyzed_response)

        if tender_serializer.is_valid() & response_serializer.is_valid():
            tender_serializer.save()
            response_serializer.save()
            Transaction.objects.create(tender=tender,response=response)
            return Response({"Message": "Done"})

        elif not tender_serializer.is_valid():
            print(tender_serializer.errors)
            return Response(tender_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif not response_serializer.is_valid():
            print(response_serializer.errors)
            return Response(response_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request,tender_id,response_id,*args,**kwargs):
        tender= Tender.objects.get(id=tender_id)
        response= TenderResponse.objects.get(id=response_id)
        confirm_status = request.data.get('confirm_status')
        if confirm_status == 'confirmed':
            return self.deanonmyze_and_save(tender=tender,response=response)

        elif confirm_status == 'rejected':
            tender.status = 'candidate_pool'
            response.status = 'rejected'
            tender.save()
            response.save()
            UserNotification.objects.create(
                recipient=tender.user, message=f'للأسف لقد رفض المورد التأكيد علي قبول مناقصة "{tender.ad.title}", لقد تم إعاده تحويل مناقصتك لمرحلة التقييم المالي لإختيار عرض اخر')
            return Response({"Message": "Done"})


class ResponseStatusUpdateAPIView(APIView):
    def put(self, request, response_id, format=None):
        try:
            response_instance = TenderResponse.objects.get(pk=response_id)
        except TenderResponse.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ResponseDetailSerializer(
            response_instance, data=request.data, partial=True)
        if serializer.is_valid():
            # Passing instance argument
            serializer.save(instance=response_instance)
            UserNotification.objects.create(recipient=response_instance.user,
                                            message=f"لقد تم إضافه عرضك لمناقصة \"{response_instance.tender.ad.title}\" لقائمة المرشحين")
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckVerifiedView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated and hasattr(user, 'verified'):
            if user.verified:
                return JsonResponse({'verified': True})
            else:
                return JsonResponse({'verified': False})
        else:
            return JsonResponse({'error': 'User is not authenticated or does not have a verified attribute'})


@csrf_exempt
def activate(request, uidb64, token):
    uid = force_str(urlsafe_base64_decode(uidb64))
    try:
        user = CustomUser.objects.get(id=uid)
    except CustomUser.DoesNotExist:
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.verified = True
        user.save()
        # Return a success JSON response
        return JsonResponse({'message': 'Account activated successfully'}, status=200)
    else:
        # Return an error JSON response
        return JsonResponse({'error': 'Activation link is invalid'}, status=400)


def activateEmail(request, user):
    mail_subject = "Activate your Tego Email."
    html_message = render_to_string('email2.html', {
        'user': user.email,
        'domain': 'localhost:3000',
        'uid': urlsafe_base64_encode(force_bytes(user.id)),
        'token': account_activation_token.make_token(user),
        "protocol": 'https' if request.is_secure() else 'http'
    })
    plain_message = strip_tags(html_message)
    message = EmailMultiAlternatives(
        subject=mail_subject,
        body=plain_message,
        to=[user.email]
    )
    message.attach_alternative(html_message, 'text/html')
    message.send()

def Similarity(APIView):
    tokenizer = load('api\models\Tokenizer_BERT_Similarity_Model.joblib')
    model = load('api\models\BERT_Similarity_Model.joblib')
    # Split the requirements from the row
    tender = 'حاسوب مكتبي|حاسوب مكتبي بمواصفات عالية يشمل معالج i7 وذاكرة RAM 16GB|50|طابعة ليزر|طابعة ليزرية ملونة ذات سرعة طباعة عالية ودقة تصل إلى 1200x1200 نقطة لكل بوصة|23|شاشة عرض|شاشة عرض LED بحجم 27 بوصة ودقة 4K مع منفذ HDMI ومعدل تحديث 60Hz|12|وحدة تخزين خارجية|وحدة تخزين خارجية سعة 2 تيرابايت مع واجهة USB 3.0 وسرعة نقل بيانات تصل إلى 5 جيجابت في الثانية|20|ماسح ضوئي|وصف المنتج: ماسح ضوئي متعدد الوظائف مع سرعة مسح تصل إلى 30 صفحة في الدقيقة ودقة تصل إلى 600 نقطة لكل بوصة|15|جهاز توجيه (راوتر)|وصف المنتج: جهاز توجيه لاسلكي يدعم ترددات 2.4GHz و 5GHz مع سرعة تصل إلى 1200 ميجابت في الثانية ونظام حماية متقدم|80|يجب تقديم ضمان لمدة سنه على الأقل.|يجب توفير خدمات الصيانة والدعم الفني لمدة عام.|'
    response = """ | | | | | |شاشة عرض|شاشة عرض LED بحجم 27 بوصة ودقة 4K مع منفذ HDMI ومعدل تحديث 60Hz|12|وحدة تخزين خارجية|وحدة تخزين خارجية سعة 2 تيرابايت مع واجهة USB 
3.0 وسرعة نقل بيانات تصل إلى 5 جيجابت في الثانية|20|ماسح ضوئي|وصف المنتج: ماسح ضوئي متعدد الوظائف مع سرعة مسح تصل إلى 30 صفحة في الدقيقة ودقة تصل إلى 600 نقطة لكل بوصة|15|جهاز توجيه (راوتر)|وصف المنتج: جهاز توجيه لاسلكي يدعم ترددات 2.4GHz و 5GHz مع سرعة تصل إلى 1200 ميجابت في الثانية ونظام حماية متقدم|80|يجب تقديم ضمان لمدة سنه على الأقل.|يجب توفير خدمات الصيانة والدعم الفني لمدة عام.|"""
    requirements_1 = tender.split('|')
    requirements_2 = response.split('|')
    # List to store similarity scores for this row
    row_similarities = []
    row_similarities_dict = []
    # Iterate over each pair of corresponding requirements
    for req1, req2 in zip(requirements_1, requirements_2):
        if req2 == ' ' or req2 == '':
            req2 = '.'*len(req1)
            similiarity_score = 0
            row_similarities.append(similiarity_score)
            row_similarities_dict.append({
                "tender_req": req1,
                "res_req": req2,
                "score": similiarity_score,
            })
            continue
        # Tokenize the requirements
        tokens1 = tokenizer(req1, return_tensors='pt',
                            padding=True, truncation=True)
        tokens2 = tokenizer(req2, return_tensors='pt',
                            padding=True, truncation=True)

        # Get embeddings for the requirements
        with torch.no_grad():
            output1 = model(**tokens1)
            output2 = model(**tokens2)

        # Compute the mean embeddings
        embedding1 = output1.last_hidden_state.mean(dim=1).squeeze().numpy()
        embedding2 = output2.last_hidden_state.mean(dim=1).squeeze().numpy()

        # Compute cosine similarity between the embeddings
        similarity_score = cosine_similarity([embedding1], [embedding2])[0][0]
        row_similarities.append(similarity_score)
        row_similarities_dict.append({
            "tender_req": req1,
            "res_req": req2,
            "score": similarity_score,
        })

    # for previous_work in offer_previous_work:
    #     tokens1 = tokenizer(previous_work, return_tensors='pt', padding=True, truncation=True)
    #     tokens2 = tokenizer(tender_ad, return_tensors='pt', padding=True, truncation=True)

    #     # Get embeddings for the requirements
    #     with torch.no_grad():
    #         output1 = model(**tokens1)
    #         output2 = model(**tokens2)

    #     # Compute the mean embeddings
    #     embedding1 = output1.last_hidden_state.mean(dim=1).squeeze().numpy()
    #     embedding2 = output2.last_hidden_state.mean(dim=1).squeeze().numpy()

    #     # Compute cosine similarity between the embeddings
    #     similarity_score = cosine_similarity([embedding1], [embedding2])[0][0]
    #     row_similarities.append(similarity_score)

    # Calculate mean similarity score for this row
    # mean_similarity_score = np.mean(row_similarities)
    # response=TenderResponse.objects.get(id=response_id)
    # response.score=round(mean_similarity_score*100)
    # response.save()
    # return row_similarities

    return Response({"message": "Score will be calculated"})


class MakeNotificationsSeen(APIView):
    def post(self, request):
        count = request.query_params.get('count')
        queryset = UserNotification.objects.filter(
            recipient=request.user).order_by('-timestamp')
        queryset.update(seen=True)
        time.sleep(5)
        return Response({"message": "Done"})


class Contract(APIView):
    def number_to_arabic_words(self, number):
        try:
            # Convert number to Arabic words
            arabic_words = num2words(number, lang='ar')
            # Reshape for proper Arabic display
            reshaped_text = arabic_reshaper.reshape(arabic_words)
            # Get display-friendly version
            bidi_text = get_display(reshaped_text)
            pattern = r'و\s+'
            cleaned_text = re.sub(pattern, 'و', bidi_text)
            return reshaped_text
        except Exception as e:
            return str(e)

    def get_written_number(self, number):
        if number % 1 == 0:
            arabic_offer_price = self.number_to_arabic_words(
                int(number)) + ' جنيه'
            return arabic_offer_price

        else:
            arabic_offer_price = self.number_to_arabic_words(
                str(number).split('.')[0]) + ' جنيه'
            arabic_offer_price = arabic_offer_price+' و ' + \
                self.number_to_arabic_words(str(number).split('.')[1]) + ' قرش'
            return arabic_offer_price
    # arabic_offer_price=number_to_arabic_words(int(response.offered_price))

    def get_arabic_date(self, date):
        with translation.override('ar'):
            day = date_format(date, format='j', use_l10n=True)
            month = date_format(date, format='F', use_l10n=True)
            year = date_format(date, format='Y', use_l10n=True)
            return f"{day} {month} عام {year}"

    def get(self, request, tender_id, response_id):
        response = TenderResponse.objects.get(id=response_id)
        tender = Tender.objects.get(id=tender_id)
        tenderad = TenderAd.objects.get(tender=tender)
        transaction = Transaction.objects.get(response=response, tender=tender)
        admins = TenderAdmin.objects.filter(tender=tender)
        host_company = Company.objects.get(user=tender.user)
        host_owners = Owner.objects.filter(company=host_company)
        supplier_company = Company.objects.get(user=response.user)
        supplier_owners = Owner.objects.filter(company=supplier_company)
        supplier_company_details = Supplier.objects.get(company=supplier_company)
        products = ResponseProductBid.objects.filter(response=response, supplying_status='متوفر')
        public_conditions = TenderPublicConditions.objects.filter(tender=tender)
        private_conditions = ResponsePrivateCondition.objects.filter(response=response)
        arabic_offer_price = ''
        arabic_ordinals = [
            "السادس عشر", "السابع عشر", "الثامن عشر", "التاسع عشر", "العشرون",
            "الحادي والعشرون", "الثاني والعشرون", "الثالث والعشرون", "الرابع والعشرون", "الخامس والعشرون", "السادس والعشرون", "السابع والعشرون", "الثامن والعشرون", "التاسع والعشرون", "الثلاثون",
            "الحادي والثلاثون", "الثاني والثلاثون", "الثالث والثلاثون", "الرابع والثلاثون", "الخامس والثلاثون", "السادس والثلاثون", "السابع والثلاثون", "الثامن والثلاثون", "التاسع والثلاثون", "الأربعون",
            "الحادي والأربعون", "الثاني والأربعون", "الثالث والأربعون", "الرابع والأربعون", "الخامس والأربعون", "السادس والأربعون", "السابع والأربعون", "الثامن والأربعون", "التاسع والأربعون", "الخمسون"
        ]
        pc = []
        for condition, order in zip(public_conditions, arabic_ordinals):
            pc.append({'condition': condition.condition,
                       'order': order})
        private_c = []
        for condition, order in zip(private_conditions, arabic_ordinals[public_conditions.count():]):
            private_c.append({'condition': condition.offered_condition,
                              'order': order})
        products_with_full_price = []
        total_price=0
        for product in products:
            product_dict = {
                'product': product.product,
                'provided_quantity': product.provided_quantity,
                'supplying_status': product.supplying_status,
                'price': product.price,
                'product_title': product.product_title,
                'product_description': product.product_description,
                'response': product.response,
                'quantity_unit': product.product.quantity_unit,
            }
            # Calculate the full price
            full_price = product_dict['provided_quantity'] * \
                product_dict['price']
            # Add the new key-value pair to the product dictionary
            product_dict['full_price'] = full_price
            total_price=total_price+full_price
            # Append the updated dictionary to the list
            products_with_full_price.append(product_dict)
            arabic_approval_date = self.get_arabic_date(
                transaction.product_review_date)
        
        context = {
            'tender_ad': tenderad,
            'tender': tender,
            'response': response,
            'admins': admins,
            'host_company': host_company,
            'host_owners': host_owners,
            'supplier_company': supplier_company,
            'supplier_owners': supplier_owners,
            'supplier_company_details': supplier_company_details,
            'arabic_offer_price': self.get_written_number(total_price),
            'products': products_with_full_price,
            'arabic_ordinals': arabic_ordinals,
            'finalInsurancePrice': tenderad.finalInsurance*0.01*total_price,
            'arabicInsurancePrice': self.get_written_number(tenderad.finalInsurance*0.01*total_price),
            'public_condition': pc,
            'private_condition': private_c,
            'transaction': transaction,
            'arabic_approval_date': arabic_approval_date
        }

        html = render_to_string('contract.html', context)
        output_pdf_path = 'output.pdf'
        pdf = pdfkit.from_string(html, False)
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="contract.pdf"'
        return response
        return render(request, 'contract.html', context)


class TransactionView(APIView):
    def get_object(self, response_id, tender_id):
        return Transaction.objects.get(response=response_id, tender=tender_id)

    def get(self, request, response_id, tender_id):
        transaction = self.get_object(response_id, tender_id)
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)

    def post(self, request, response_id, tender_id):
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, response_id, tender_id):
        transaction = self.get_object(response_id, tender_id)
        serializer = TransactionSerializer(transaction, data=request.data,partial=True)
        if serializer.is_valid():
            if request.data.get('product_review_date_status') == 'waiting_for_supplier':
                UserNotification.objects.create(
                    recipient=transaction.response.user, message="مالك المناقصة حدد موعد لمراجة المنتجات ‘ يرجي التأكيد علي الموعد او اختيار موعد اخر")
            elif request.data.get('product_review_date_status') == 'waiting_for_host':
                UserNotification.objects.create(
                    recipient=transaction.tender.user, message="مورد المناقصة لم يوافق علي الموعد المحدد")
            elif request.data.get('product_review_date_status') == 'accepted':
                UserNotification.objects.create(
                    recipient=transaction.tender.user, message=f"تم تحديد موعد {transaction.product_review_date} لمراجعة المنتجات")
                UserNotification.objects.create(
                    recipient=transaction.response.user, message=f"تم تحديد موعد {transaction.product_review_date} لمراجعة المنتجات")
            elif request.data.get('product_review_status') == 'accepted':
                UserNotification.objects.create(
                    recipient=transaction.response.user, message=f"لقد وافق مالك مناقصه {transaction.tender.ad.title} علي المنتجات المقدمة من شركتكم")
            elif request.data.get('product_review_status') == 'rejected':
                tender = transaction.tender
                response = transaction.response
                UserNotification.objects.create(
                    recipient=transaction.response.user,
                    message=f"لقد رفض مالك مناقصه {transaction.tender.ad.title} علي المنتجات المقدمة من شركتكم")
                tender.status = 'candidate_pool'
                tender.save()
                response.status = 'rejected'
                response.save()
                UserNotification.objects.create(
                    recipient=transaction.tender.user, message=f"لقد تم اعاده فتح التقييم المالي مرة أخري")
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    def get_queryset(self):
        user_type = self.request.query_params.get('user_type')
        if user_type == 'host':
            queryset = Transaction.objects.filter(
                tender__user=self.request.user, product_review_status='accepted')
            return queryset
        elif user_type == 'supplier':
            queryset = Transaction.objects.filter(
                response__user=self.request.user, product_review_status='accepted')
            return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class model(APIView):
    permission_classes = []

    def get_model_prediction(self, input_data):
        url = 'http://127.0.0.1:9000/predict/'
        params = {
            "input_data": input_data
        }
        response = requests.post(url, params=params)
        if response.status_code == 200:
            return response.json()['prediction']
        else:
            raise Exception(
                f"API request failed with status code {response.status_code}: {response.text}")

    def post(self, request):
        prediction = self.get_model_prediction('شركة احمد محمد ابراهيم')
        return Response({'prediction': prediction})
from django.conf import settings
class googleAuth(APIView):
    permission_classes=[]
    def get(self,request):
        # Google's OAuth 2.0 authorization endpoint
        authorization_base_url = "https://accounts.google.com/o/oauth2/auth"
        scope = "openid email profile"
        redirect_uri = settings.GOOGLE_REDIRECT_URI

        authorization_url = (
            f"{authorization_base_url}?response_type=code&client_id={settings.GOOGLE_CLIENT_ID}"
            f"&redirect_uri={redirect_uri}&scope={scope}&access_type=offline&prompt=consent"
        )
        print(authorization_url)
        return Response({"url":authorization_url})

from pprint import pprint
class oauth2callback(APIView):
    permission_classes=[]
    def get(self,request):
        code = request.data.get('code')
        print("CODE IS ",code)
        token_url = "https://oauth2.googleapis.com/token"
        redirect_uri = settings.GOOGLE_REDIRECT_URI
        token_data = {
            'code': code,
            'client_id': settings.GOOGLE_CLIENT_ID,
            'client_secret': settings.GOOGLE_CLIENT_SECRET,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code'
        }
        token_response = requests.post(token_url, data=token_data)
        token_json = token_response.json()
        access_token = token_json.get('access_token')
        
        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        user_info_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
        user_info = user_info_response.json()

        # Process user info and log the user in
        # You need to implement this part according to your application's requirements.
        return Response({"User Info:": user_info})
        