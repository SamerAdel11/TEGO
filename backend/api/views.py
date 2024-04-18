from django.shortcuts import render

from .models import CustomUser, Company, UserNotification, Tender, TenderResponse

from rest_framework.decorators import api_view, permission_classes

from rest_framework.response import Response

from .serializer import UserSerializer, CompanySerializer, NotificationnSerializer, TenderSerializer, ResponseSerializer, TenderRetrieveSerializer

from rest_framework import generics, status, serializers

from rest_framework.views import APIView

from rest_framework.exceptions import AuthenticationFailed

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# @api_view(['POST'])

# def CompanyView(request):

#     serializer = CompanySerializer(data=request.data)

#     if serializer.is_valid(raise_exception=True):

#         response=serializer.save()

#         return Response(response.data)

#     else:

#         return Response(serializer.errors)


class CompanyView(APIView):

    permission_classes = []

    def post(self, request, *args, **kwargs):

        serializer = CompanySerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):

            response = serializer.save()

            return Response(response)

        else:

            return Response(serializer.errors)

    def put(self, request, *args, **kwargs):

        email = request.data.get('user').get('email', None)

        if email is None:

            return Response({'error': 'Email is required in the request data.'},

                            status=status.HTTP_400_BAD_REQUEST)

        instance = Company.objects.filter(user__email=email).first()

        serializer = CompanySerializer(instance=instance, data=request.data)

        print('serializer is valid')

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


class TenderListView(generics.ListAPIView):

    serializer_class = TenderRetrieveSerializer

    def get_queryset(self):

        user = self.request.user
        print(user)

        queryset = Tender.objects.filter(user=user)

        return queryset

    def get(self, request, *args, **kwargs):

        response = super().list(request, *args, **kwargs)

        print(response.data)  # Print the response data
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
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResponseListAPIView(generics.ListAPIView):
    serializer_class = ResponseSerializer
    def get_queryset(self):
        # Filter the queryset based on the currently authenticated user
        user = self.request.user
        return TenderResponse.objects.filter(user=user)
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

from . import serializer

class ResponseDetailAPIView(generics.ListAPIView):
    serializer_class = serializer.ResponseDetailSerializer
    def get_queryset(self):
        # Filter the queryset based on the currently authenticated user
        user = self.request.user
        tender_id = self.request.query_params.get('tender_id', None)
        print(f"tender id is {tender_id}")
        if tender_id is None:
            print("tender_id is none")
            return Response({'message':"tender id must be passed as a url parameter"})
        tender_instance=Tender.objects.get(id=tender_id)
        queryset=TenderResponse.objects.filter(user=user,tender=tender_instance)
        status = self.request.query_params.get('status', None)
        import pprint
        print(self.request.META)
        if status:
            print("entered status")
            queryset = queryset.filter(status=status)
        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

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
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.shortcuts import render, redirect
from .forms import CustomUserForm
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.contrib import messages
from .tokens import account_activation_token

def activate(request, uidb64, token):
    uid = force_str(urlsafe_base64_decode(uidb64))
    user = CustomUser.objects.get(id=uid)
    print(f"user if {user}")

    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()

        messages.success(request, "Thank you for your email confirmation. Now you can login your account.")
        return redirect('email')
    else:
        messages.error(request, "Activation link is invalid!")

    return redirect('email')

def activateEmail(request, user, to_email):
    mail_subject = "Activate your user account."
    message = render_to_string("text.html", {
        'user': user.email,
        'domain': get_current_site(request).domain,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user),
        "protocol": 'https' if request.is_secure() else 'http'
    })
    import socket
    socket.getaddrinfo('localhost', 8000)
    print(message)
    email = EmailMessage(mail_subject, message, to=[to_email])
    if email.send():
        messages.success(request, f'Dear <b>{user}</b>, please go to you email <b>{to_email}</b> inbox and click on \
                received activation link to confirm and complete the registration. <b>Note:</b> Check your spam folder.')
    else:
        messages.error(request, f'Problem sending email to {to_email}, check if you typed it correctly.')


def create_custom_user(request):
    if request.method == 'POST':
        form = CustomUserForm(request.POST)
        if form.is_valid():
            user=form.save(commit=False)
            user.is_active=False
            user.save()
            activateEmail(request, user, form.cleaned_data.get('email'))
            return redirect('email')  # Redirect to a success page
    else:
        form = CustomUserForm()
    return render(request, 'create_custom_user.html', {'form': form})

def email(request):
    return render(request,'email.html')
# class UserView(APIView):

#     def get(self, request):

#         print(request)

#         token = request.COOKIES.get('jwt')

#         if not token:
#             raise AuthenticationFailed('Unauthenticated!')
#         try:
#             payload = jwt.decode(token, 'secret', algorithms=['HS256'])
#         except jwt.ExpiredSignatureError:
#             raise AuthenticationFailed('Unauthenticated')
#         user = CustomUser.objects.get(id=payload['id'])
#         serializer = UserSerializer(user)
#         return Response(serializer.data)

# @api_view(['POST'])
# def UserView(request):
#     serializer = UserSerializer(data=request.data)
#     if serializer.is_valid():
#         response = serializer.save()
#         print(type(response))
#         print(response)
#         return Response(response)
#     else:
#         return Response(serializer.errors)

# class CompanyView(generics.ListAPIView, generics.CreateAPIView,
#                 generics.RetrieveAPIView,generics.UpdateAPIView):
#     queryset = Company.objects.all()
#     serializer_class = CompanySerializer
#     def perform_create(self,serializer):
#         serializer=serializer.save()
#         print(f"serializer is {serializer}")
#         return serializer


#     def get(self, request, *args, **kwargs):
#         pk = kwargs.get("pk")
#         if pk is None:
#             return self.list(request, *args, **kwargs)
#         else:
#             return self.retrieve(request, *args, **kwargs)
#     def post(self, request,*args,**kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         new_serializer_data=self.perform_create(serializer)
#         headers = self.get_success_headers(serializer.data)
#         return Response(new_serializer_data)





# class LoginView(APIView):
#     def create_access_token(email):
#         return jwt.encode({
#             'email': email,
#             'exp': datetime.datetime.utcnow()+datetime.timedelta(minutes=60),
#             'iat': datetime.datetime.utcnow()
#         }, 'secret', algorithm='HS256')

#     def create_refresh_token(email):
#         return jwt.encode({
#             'email': email,
#             'exp': datetime.datetime.utcnow()+datetime.timedelta(days=7),
#             'iat': datetime.datetime.utcnow()
#         }, 'secret', algorithm='HS256')


#     def post(self, request):
#         # def create_access_token(email):
#         #     return jwt.encode({
#         #     'email': email,
#         #     'exp': datetime.datetime.utcnow()+datetime.timedelta(minutes=60),
#         #     'iat': datetime.datetime.utcnow()
#         # }, 'secret', algorithm='HS256')

#         # def create_refresh_token(email):
#         #     return jwt.encode({
#         #         'email': email,
#         #         'exp': datetime.datetime.utcnow()+datetime.timedelta(days=7),
#         #         'iat': datetime.datetime.utcnow()
#         #     }, 'secret', algorithm='HS256')


#         email = request.data['email']
#         password = request.data['password']
#         user = CustomUser.objects.filter(email=email).first()
#         if user is None:
#             raise AuthenticationFailed("user not exist")

#         if not user.check_password(password):
#             raise AuthenticationFailed("password isn't correct")


#         access_token = jwt.encode({
#             'email': email,
#             'exp': datetime.datetime.utcnow()+datetime.timedelta(days=1),
#             'iat': datetime.datetime.utcnow()

#         }, 'secret', algorithm='HS256')


#         refresh_token = jwt.encode({
#             'email': email,
#             'exp': datetime.datetime.utcnow()+datetime.timedelta(days=7),
#             'iat': datetime.datetime.utcnow()
#         }, 'secret', algorithm='HS256')


#         print({access_token})
#         response = Response()
#         response.set_cookie(key='jwt', value=access_token, httponly=True)
#         response.data = {
#             'roles': [2001, 5150],
#             'access': access_token,
#             'refresh': refresh_token

#         }
#         return response
