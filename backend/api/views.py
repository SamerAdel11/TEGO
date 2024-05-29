from django.shortcuts import render
from .models import CustomUser, Company, UserNotification, Tender, TenderResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializer import UserSerializer, CompanySerializer, NotificationnSerializer, TenderSerializer, ResponseSerializer, TenderRetrieveSerializer
from rest_framework import generics, status, serializers
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from tasks.tasks import activate_account
from joblib import dump, load
import torch
from tasks.tasks import compute_similarity
class CompanyView(APIView):

    permission_classes = []
    def get(self,request,*args,**kwargs):
        response_id= request.query_params.get("response_id")
        user=TenderResponse.objects.get(id=response_id).user
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

class TenderSupplierView(generics.ListAPIView):
    serializer_class = TenderRetrieveSerializer
    def get_queryset(self):
        user = self.request.user
        responsestatus = self.request.query_params.get('responsestatus', None)
        print(responsestatus)
        queryset = Tender.objects.filter(user=user)
        if responsestatus:
            # queryset=queryset.exclude(tenderresponse__user=request.user)
            return queryset.filter(tenderresponse__status=responsestatus)
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
        queryset=TenderResponse.objects.filter(user=user,tender=tender_instance)
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
        print(serialized_version)
        return Response(serialized_version.data)

class CloseCandidatePool(APIView):
    def get(self, request, *args, **kwargs):
        print("Entered get function")
        tender_id = self.request.query_params.get('tender_id', None)
        tender= Tender.objects.get(id=tender_id)
        tender.status='candidate_pool'
        tender.save()
        print(tender_id)
        responses= TenderResponse.objects.filter(tender=tender)
        print(responses)
        for response in responses:
            print(response.status)
            if response.status=='open' or response.status=='offered':
                print(f'status is {response.status}')
                response.status='rejected'
                response.save()
                UserNotification.objects.create(
                    recipient=response.user,
                    message=f'unfortunately your offer has been rejected from the tender{response.tender.ad.title}'
                )
        return Response({"Message":"Done"})

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
        if confirm_status=='confirmed':
            tender.status='awarded'
            response.status='winner'
            tender.save()
            response.save()
        elif confirm_status=='rejected':
            tender.status=='candidate_pool'
            response.status=='rejected'
            tender.save()
            response.save()
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
    print("Entered activate function")
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
            print("")
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
        