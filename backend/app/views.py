from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from .models import User
from .serializer import UserSerializer
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password

# Create your views here.

class LoginView(APIView):

    def get(self, request):
        # Retrieve all User instances from the database
        instance = User.objects.all()
        data={}
        if instance:
            # Many because if not it doesn't work
            data = UserSerializer(instance, many=True).data
        return Response(data)
    
    def post(self, request):
        #get password from request
        password = request.data.get('password')
        #hash that password
        hashed_password = make_password(password)
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            #access to field
            serializer.validated_data['password'] = hashed_password

            # Save the serializer instance to create a new User object
            instance = serializer.save()
            
           
            return Response(serializer.data)
        
        
        return Response({"invalid":"not good data"}, status=400)
        