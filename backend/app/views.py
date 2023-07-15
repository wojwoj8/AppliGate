from django.shortcuts import render
from rest_framework import viewsets, status, generics, mixins, authentication, permissions
from rest_framework.views import APIView
from .models import User
from .serializer import UserSerializer
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate, login, logout

    
class SignupView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
    ):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        password = request.data.get('password')
        confirm = request.data.get('confirm')

        if confirm != password:
            return Response({"invalid": "Passwords do not match"}, status=400)

        #hash that password
        hashed_password = make_password(password)
        request.data['password'] = hashed_password
        return self.create(request, *args, **kwargs)


    
class LoginView(
    mixins.CreateModelMixin,
    generics.GenericAPIView
):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Return success response if login is successful
            return Response({'message': 'Login successful'})
        else:
            # Return error response if login is unsuccessful
            return Response({'error': 'Invalid credentials'}, status=400)
        
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'})   
         
class IndexView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
    mixins.RetrieveModelMixin,
    ):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        username = kwargs.get('username')
        if username is not None:
            return self.retrieve(request, *args, **kwargs)