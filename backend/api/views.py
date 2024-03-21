from django.shortcuts import render
from .models import CustomUser, Company
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializer import UserSerializer, CompanySerializer
from rest_framework import generics, status
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
import jwt
import datetime
# @api_view(['POST'])
# def CompanyView(request):
#     serializer = CompanySerializer(data=request.data)
#     if serializer.is_valid(raise_exception=True):
#         response=serializer.save()
#         return Response(response.data)
#     else:
#         return Response(serializer.errors)


class CompanyView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            response = serializer.save()
            return Response(response)
        else:
            return Response(serializer.errors)


    def put(self,request,*args,**kwargs):
        email=request.data.get('user').get('email',None)
        if email is None:
            return Response({'error': 'Email is required in the request data.'},
            status=status.HTTP_400_BAD_REQUEST)
        instance=Company.objects.filter(user__email=email).first()
        serializer=CompanySerializer(instance=instance,data=request.data)
        print('serializer is valid')
        serializer.update(instance,request.data)
        return Response(CompanySerializer(instance).data)   



class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user = CustomUser.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed("user not exist")
        if not user.check_password(password):
            raise AuthenticationFailed("password isn't correct")

        payload = {
            "id": user.id,
            'exp': datetime.datetime.utcnow()+datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }
        token = jwt.encode(payload, 'secret',
                        algorithm='HS256')

        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
        return response

class UserView(APIView):
    def get(self,request):
        print(request)
        token=request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload=jwt.decode(token,'secret',algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')
        user=CustomUser.objects.get(id=payload['id'])
        serializer=UserSerializer(user)
        return Response(serializer.data)


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


# class Stakeholders(generics.ListAPIView,generics.CreateAPIView):
#     queryset=Stakeholders.objects.all()
#     serializer_class=StakeholdersSerializer
#     def get(self,request,*args,**kwargs):
#         return self.list(request,*args,**kwargs)

#     def post(self,request,*args,**kwargs):
#         return self.create(request,*args,**kwargs)
