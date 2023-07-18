from django.shortcuts import render
from rest_framework import viewsets, status, generics, mixins, authentication, permissions
from rest_framework.views import APIView
from .models import User
from .serializer import UserSerializer
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import permission_classes\
    ,authentication_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.sessions.backends.db import SessionStore
    
class SignupView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
    ):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        password = request.data.get('password')
        confirm = request.data.get('confirm')

        if confirm != password:
            return Response({"invalid": "Passwords do not match"}, status=400)

        #hash that password
        hashed_password = make_password(password)
        request.data['password'] = hashed_password
        return self.create(request, *args, **kwargs)

         
class IndexView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
    mixins.RetrieveModelMixin,
    ):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        username = kwargs.get('username')
        if username is not None:
            return self.retrieve(request, *args, **kwargs)