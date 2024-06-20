from django.shortcuts import render
from .models import CustomUser, Company, UserNotification, Tender, TenderResponse, Transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializer import TransactionSerializer, UserSerializer, CompanySerializer, NotificationnSerializer, TenderSerializer, ResponseSerializer, TenderRetrieveSerializer
from rest_framework import generics, status, serializers
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from tasks.tasks import activate_account
from joblib import dump, load
import torch
from tasks.tasks import compute_similarity
from django.utils.formats import date_format
from django.utils import translation
class CompanyView(APIView):

    permission_classes = []
    def get(self,request,*args,**kwargs):
        response_id= request.query_params.get("response_id")
        tender_id=request.query_params.get("tender_id")
        if response_id:
            user=TenderResponse.objects.get(id=response_id).user
            company=Company.objects.get(user=user)
            serialized_data= CompanySerializer(company).data
            return Response(serialized_data)
        elif tender_id:
            print(tender_id)
            user=Tender.objects.get(id=tender_id).user
            company=Company.objects.get(user=user)
            serialized_data= CompanySerializer(company).data
            return Response(serialized_data)

    def post(self, request, *args, **kwargs):
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            activate_account.delay(user.id)
            return Response({"data":"data has been submitted succesfully"})
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


class TenderCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = TenderSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            response = serializer.save()
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self,request,*args,**kwargs):
        tender_id= request.data.get('id')
        try:
            tender_instance = Tender.objects.get(id=tender_id)
        except Tender.DoesNotExist:
            return Response({"error": "Tender not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TenderSerializer(tender_instance,
            data=request.data, context={'request': request})
        if serializer.is_valid():
            response = serializer.save(instance=tender_instance)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RetrieveTender(generics.RetrieveAPIView):
    queryset=Tender.objects.all()
    serializer_class=TenderSerializer
    lookup_field='pk'
    def get(self,request,*args,**kwargs):
        return self.retrieve(request)

class TenderHostView(generics.ListAPIView):
    serializer_class = TenderRetrieveSerializer
    def get_queryset(self):
        user = self.request.user
        status = self.request.query_params.get('status', None)
        queryset = Tender.objects.filter(user=user)
        if status:
            status_list = status.split(',')
            return queryset.filter(status__in=status_list)
        return queryset

class UpdateTenderStatus(APIView):
    def put(self,request):
        tender_id=request.query_params.get('tender_id',None)
        new_status=request.query_params.get('new_status',None)
        if tender_id != None and new_status != None:
            tender_instance= Tender.objects.get(id=tender_id)
            tender_instance.status=new_status
            tender_instance.save()
            return Response({"Message":"Done"})
        else:
            return Response({"Message":"tender_id or status is missing"},
            status=status.HTTP_400_BAD_REQUEST)
class TenderSupplierView(generics.ListAPIView):
    serializer_class = TenderRetrieveSerializer
    def get_queryset(self):
        user = self.request.user
        responsestatus = self.request.query_params.get('responsestatus', None)
        company=Company.objects.get(user=user)
        queryset = Tender.objects.filter(ad__field=company.company_field)
        if responsestatus:
            status_list = responsestatus.split(',')
            # queryset=queryset.exclude(tenderresponse__user=request.user)
            return queryset.filter(tenderresponse__status__in=status_list,tenderresponse__user=user)
        return queryset.exclude(tenderresponse__user=self.request.user)

    def get(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return response

class NotificationView(generics.ListAPIView):
    serializer_class = NotificationnSerializer
    def get_queryset(self):
        # Filter the queryset based on the currently authenticated user
        user = self.request.user
        return UserNotification.objects.filter(recipient=user)
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


def home(request):
    return render(request, 'index.html')

class ResponseView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ResponseSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            response = serializer.save()
            return Response(request.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class ResponseListAPIView(generics.ListAPIView):
#     serializer_class = ResponseSerializer
#     def get_queryset(self):
#         # Filter the queryset based on the currently authenticated user
#         user = self.request.user
#         return TenderResponse.objects.filter(user=user)
#     def get(self, request, *args, **kwargs):
#         return self.list(request, *args, **kwargs)

from . import serializer

class ResponseDetailAPIView(generics.ListAPIView):
    serializer_class = serializer.ResponseDetailSerializer
    def get_queryset(self):
        # Filter the queryset based on the currently authenticated user
        user = self.request.user
        tender_id = self.request.query_params.get('tender_id', None)
        if tender_id is None:
            return Response({'message':"tender id must be passed as a url parameter"},)
        tender_instance=Tender.objects.get(id=tender_id)
        queryset=TenderResponse.objects.filter(tender=tender_instance)
        status = self.request.query_params.get('status', None)
        if status:
            status_list = status.split(',')
            return queryset.filter(status__in=status_list)
        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class MyResponseDetailAPIView(APIView):
    def get(self,request,*args,**kwargs):
        user=self.request.user
        tender_id = self.request.query_params.get('tender_id', None)
        response= TenderResponse.objects.get(user=user,tender=Tender.objects.get(id=tender_id))
        serialized_version= ResponseDetailSerializer(response)
        return Response(serialized_version.data)

class CloseCandidatePool(APIView):
    def get(self, request, *args, **kwargs):
        tender_id = self.request.query_params.get('tender_id', None)
        tender= Tender.objects.get(id=tender_id)
        responses= TenderResponse.objects.filter(tender=tender)
        candidate_response_exist=False
        for response in responses:
            if response.status=='open' or response.status=='offered':
                response.status='rejected'
                response.save()
                UserNotification.objects.create(
                    recipient=response.user,
                    message=f'unfortunately your offer has been rejected from the tender{response.tender.ad.title}'
                )
            elif response.status=='candidate_pool':
                candidate_response_exist=True
        if candidate_response_exist:
            tender.status='candidate_pool'
            tender.save()
            return Response({"Message":"candidate_pool"})

        else:
            tender.status='cancelled'
            tender.save()
            UserNotification.objects.create(recipient=tender.user,
                                            message=f'تم الغاء مناقصة {tender.ad.title} لعدم اختيار عروض للمرحله القادمة')
        return Response({"Message":"cancelled"})
class CancelTender(APIView):
    def post(self,request,*args,**kwargs):
        tender_id=request.query_params.get('tender_id')
        tender=Tender.objects.get(id=tender_id)
        responses=TenderResponse.objects.filter(tender=tender)
        for response in responses:
            if response.status=='open' or response.status=='offered':
                response.status='rejected'
                response.save()
                UserNotification.objects.create(
                    recipient=response.user,
                    message=f'unfortunately your offer has been rejected from the tender{response.tender.ad.title}'
                )
        tender.status='cancelled'
        tender.save()
        return Response({"Message":"cancelled"})

class AwardResponse(APIView):
    def post(self,request):
        tender_id=request.query_params.get("tender")
        response_id=request.query_params.get("response")
        tender=Tender.objects.get(id=tender_id)
        response=TenderResponse.objects.get(id=response_id)
        tender.status="awaiting_confirmation"
        tender.save()
        response.status="awarded"
        response.save()
        return Response({"Message":"Done"})

class SupplierConfirmation(APIView):
    def post(self,request):
        tender= Tender.objects.get(id=self.request.query_params.get('tender_id'))
        response= TenderResponse.objects.get(id=self.request.query_params.get('response_id'))
        confirm_status = self.request.query_params.get('confirm_status')
        print(confirm_status)
        if confirm_status=='confirmed':
            print("Enter the first for loop")
            tender.status='awarded'
            response.status='winner'
            tender.save()
            response.save()
            Transaction.objects.create(tender=tender,response=response)

        elif confirm_status=='rejected':
            tender.status='candidate_pool'
            response.status='rejected'
            tender.save()
            response.save()
            UserNotification.objects.create(recipient=tender.user,message=f"Unfortunately the supplier refused to confirm at your tender {tender.ad.title} so we reopened the candidate pool, you can find your tender their")

        return Response({"Message":"Done"})

from .serializer import ResponseDetailSerializer
class ResponseStatusUpdateAPIView(APIView):
    def put(self, request, response_id, format=None):
        try:
            response_instance = TenderResponse.objects.get(pk=response_id)
        except TenderResponse.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ResponseDetailSerializer(response_instance, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save(instance=response_instance)  # Passing instance argument
            UserNotification.objects.create(recipient=response_instance.user,
            message="Congratulations your offer has been awarded to the candidate pool stage")
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.contrib.auth.decorators import login_required

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

from django.shortcuts import render, redirect
from .forms import CustomUserForm
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.contrib import messages
from .tokens import account_activation_token
from django.http import JsonResponse
from rest_framework.decorators import authentication_classes
from django.views.decorators.csrf import csrf_exempt

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

from django.core.mail import send_mail, EmailMultiAlternatives
from django.utils.html import strip_tags
def activateEmail(request, user):
    mail_subject = "Activate your Tego Email."
    html_message=render_to_string('email2.html',{
        'user': user.email,
        'domain': 'localhost:3000',
        'uid': urlsafe_base64_encode(force_bytes(user.id)),
        'token': account_activation_token.make_token(user),
        "protocol": 'https' if request.is_secure() else 'http'
    })
    plain_message= strip_tags(html_message)
    message=EmailMultiAlternatives(
        subject=mail_subject,
        body=plain_message,
        to=[user.email]
    )
    message.attach_alternative(html_message,'text/html')
    message.send()

from tasks.tasks import activate_account
def create_custom_user(request):
    if request.method == 'POST':
        form = CustomUserForm(request.POST)
        if form.is_valid():
            user=form.save(commit=False)
            user.is_active=False
            user.save()
            activateEmail.delay(request, user, form.cleaned_data.get('email'))
            return redirect('email')  # Redirect to a success page
    else:
        form = CustomUserForm()
    return render(request, 'create_custom_user.html', {'form': form})

def email(request):
    return render(request,'email2.html')


class test(APIView):
    permission_classes=[]
    def post(self,request):
        from pprint import pprint
        pprint(request.data)
        return Response(request.data)


class Similarity(APIView):
    permission_classes=[]
    def post(self,request):
        tender=request.data['tender']
        response=request.data['response']
        score=compute_similarity.delay(tender,response)
        return Response({"message":"Score will be calculated"})
import time
class MakeNotificationsSeen(APIView):
    def post(self, request):
        count=request.query_params.get('count')
        queryset=UserNotification.objects.filter(recipient=request.user).order_by('-timestamp')
        queryset.update(seen=True)
        time.sleep(5)
        return Response({"message":"Done"})
from .models import TenderAd
from .models import TenderAdmin
from .models import Owner
from .models import TenderProduct
from .models import ResponseProductBid
from .models import Supplier
from .models import TenderPublicConditions
from .models import ResponsePrivateCondition
from word2number import w2n
from num2words import num2words
import arabic_reshaper
from bidi.algorithm import get_display
import re
import pdfkit
from django.shortcuts import HttpResponse
from jinja2 import Environment, FileSystemLoader

class Contract(APIView):
    def number_to_arabic_words(self,number):
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
    def get_written_number(self,number):
        if number % 1==0:
            arabic_offer_price=self.number_to_arabic_words(int(number))+ ' جنيه'
            return arabic_offer_price

        else:
            arabic_offer_price=self.number_to_arabic_words(str(number).split('.')[0])+ ' جنيه'
            arabic_offer_price=arabic_offer_price+' و '+self.number_to_arabic_words(str(number).split('.')[1])+ ' قرش'
            return arabic_offer_price
    # arabic_offer_price=number_to_arabic_words(int(response.offered_price))
    # print(arabic_offer_price)
    def get_arabic_date(self,date):
        with translation.override('ar'):
            day = date_format(date, format='j', use_l10n=True)
            month = date_format(date, format='F', use_l10n=True)
            year = date_format(date, format='Y', use_l10n=True)
            return f"{day} {month} عام {year}"
    def post(self,request, tender_id,response_id):
        response=TenderResponse.objects.get(id=response_id)
        tender=Tender.objects.get(id=tender_id)
        tenderad=TenderAd.objects.get(tender=tender)
        transaction= Transaction.objects.get(response=response,tender=tender)
        admins= TenderAdmin.objects.filter(tender=tender)
        host_company=Company.objects.get(user=tender.user)
        host_owners= Owner.objects.filter(company=host_company)
        supplier_company= Company.objects.get(user=response.user)
        supplier_owners= Owner.objects.filter(company=supplier_company)
        supplier_company_details =Supplier.objects.get(company=supplier_company)
        products=ResponseProductBid.objects.filter(response=response,supplying_status='متوفر')
        public_conditions= TenderPublicConditions.objects.filter(tender=tender)
        private_conditions= ResponsePrivateCondition.objects.filter(response=response)
        arabic_offer_price=''
        arabic_ordinals = [
            "السادس عشر", "السابع عشر", "الثامن عشر", "التاسع عشر", "العشرون",
            "الحادي والعشرون", "الثاني والعشرون", "الثالث والعشرون", "الرابع والعشرون", "الخامس والعشرون", "السادس والعشرون", "السابع والعشرون", "الثامن والعشرون", "التاسع والعشرون", "الثلاثون",
            "الحادي والثلاثون", "الثاني والثلاثون", "الثالث والثلاثون", "الرابع والثلاثون", "الخامس والثلاثون", "السادس والثلاثون", "السابع والثلاثون", "الثامن والثلاثون", "التاسع والثلاثون", "الأربعون",
            "الحادي والأربعون", "الثاني والأربعون", "الثالث والأربعون", "الرابع والأربعون", "الخامس والأربعون", "السادس والأربعون", "السابع والأربعون", "الثامن والأربعون", "التاسع والأربعون", "الخمسون"
        ]
        pc=[]
        for condition,order in zip(public_conditions,arabic_ordinals):
            pc.append({'condition':condition.condition,
                        'order': order})
        private_c=[]
        for condition,order in zip(private_conditions,arabic_ordinals[public_conditions.count():]):
            private_c.append({'condition':condition.offered_condition,
                'order': order})
        products_with_full_price=[]
        for product in products:
            print(product.product.quantity_unit)
            product_dict = {
                'product':product.product,
                'provided_quantity':product.provided_quantity,
                'supplying_status':product.supplying_status,
                'price':product.price,
                'product_title':product.product_title,
                'product_description':product.product_description,
                'response':product.response,
                'quantity_unit':product.product.quantity_unit,
                
            }
            # Calculate the full price
            full_price = product_dict['provided_quantity'] * product_dict['price']
            # Add the new key-value pair to the product dictionary
            product_dict['full_price'] = full_price
            # Append the updated dictionary to the list
            products_with_full_price.append(product_dict)
            arabic_approval_date=self.get_arabic_date(transaction.product_review_date)
        context={
            'tender_ad':tenderad,
            'tender':tender,
            'response': response,
            'admins':admins,
            'host_company':host_company,
            'host_owners':host_owners,
            'supplier_company':supplier_company,
            'supplier_owners':supplier_owners,
            'supplier_company_details':supplier_company_details,
            'arabic_offer_price':self.get_written_number(response.offered_price),
            'products':products_with_full_price,
            'arabic_ordinals':arabic_ordinals,
            'finalInsurancePrice': tenderad.finalInsurance*0.01*response.offered_price,
            'arabicInsurancePrice':self.get_written_number(tenderad.finalInsurance*0.01*response.offered_price),
            'public_condition': pc,
            'private_condition': private_c,
            'transaction':transaction,
            'arabic_approval_date':arabic_approval_date
            }

        html=render_to_string('contract.html',context)
        output_pdf_path = 'output.pdf'
        pdf=pdfkit.from_string(html, False)
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="contract.pdf"'
        return response
        return render(request,'contract.html',context)

class TransactionView(APIView):
    def get_object(self, response_id, tender_id):
        return Transaction.objects.get(response=response_id, tender=tender_id)

    def get(self, request, response_id, tender_id):
        transaction = self.get_object(response_id, tender_id)
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)

    def post(self, request, response_id,tender_id):
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, response_id, tender_id):
        transaction = self.get_object(response_id, tender_id)
        serializer = TransactionSerializer(transaction, data=request.data)
        if serializer.is_valid():
            if request.data.get('product_review_date_status') == 'waiting_for_supplier':
                UserNotification.objects.create(recipient=transaction.response.user,message="مالك المناقصة حدد موعد لمراجة المنتجات ‘ يرجي التأكيد علي الموعد او اختيار موعد اخر")
            elif request.data.get('product_review_date_status') == 'waiting_for_host':
                UserNotification.objects.create(recipient=transaction.tender.user,message="مورد المناقصة لم يوافق علي الموعد المحدد")
            elif request.data.get('product_review_date_status') == 'accepted':
                UserNotification.objects.create(recipient=transaction.tender.user,message=f"تم تحديد موعد {transaction.product_review_date} لمراجعة المنتجات")
                UserNotification.objects.create(recipient=transaction.response.user,message=f"تم تحديد موعد {transaction.product_review_date} لمراجعة المنتجات")
            elif request.data.get('product_review_status') == 'accepted':
                UserNotification.objects.create(recipient=transaction.response.user,message=f"لقد وافق مالك مناقصه {transaction.tender.ad.title} علي المنتجات المقدمة من شركتكم" )
            elif request.data.get('product_review_status') == 'rejected':
                UserNotification.objects.create(recipient=transaction.response.user,message=f"لقد رفض مالك مناقصه {transaction.tender.ad.title} علي المنتجات المقدمة من شركتكم" )
                tender.status='candidate_pool'
                tender.save()
                response.status='rejected'
                response.save()
                UserNotification.objects.create(recipient=transaction.tender.user,message=f"لقد تم اعاده فتح قائمة المرشحين مرة أخري" )
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransactionListView(generics.ListAPIView):
    serializer_class=TransactionSerializer
    def get_queryset(self):
        user_type=self.request.query_params.get('user_type')
        if user_type== 'host':
            queryset = Transaction.objects.filter(tender__user=self.request.user,product_review_status='accepted')
            return queryset
        elif user_type=='supplier':
            queryset = Transaction.objects.filter(response__user=self.request.user,product_review_status='accepted')
            return queryset

    def get(self,request,*args,**kwargs):
        return self.list(request,*args,**kwargs)
import requests
class model(APIView):
    permission_classes=[]
    def get_model_prediction(self,input_data):
        url = 'http://127.0.0.1:9000/annonymize/'
        params = {
            "input_data": input_data
        }
        response = requests.post(url, params=params)
        if response.status_code == 200:
            return response.json()['prediction']
        else:
            raise Exception(f"API request failed with status code {response.status_code}: {response.text}")
    def post(self,request):
        prediction = self.get_model_prediction('شركة احمد محمد ابراهيم')
        return Response({'prediction':prediction})