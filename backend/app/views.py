from django.shortcuts import render
from rest_framework import viewsets, status, generics, mixins
from rest_framework.views import APIView
from .models import User
from .serializer import UserSerializer
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password

# Create your views here.

# class SignupView(APIView):

#     def get(self, request):
#         # Retrieve all User instances from the database
#         instances = User.objects.all()
#         data={}
#         if instances:
#             # Many because if not it doesn't work
#             data = UserSerializer(instances, many=True).data
#         return Response(data)
    
#     def post(self, request):
#         #get password from request
#         password = request.data.get('password')
#         confirm = request.data.get('confirm')

#         if (confirm != password):
#             return Response({"invalid":"not good data"}, status=400)

#         #hash that password
#         hashed_password = make_password(password)
#         serializer = UserSerializer(data=request.data)


#         if serializer.is_valid(raise_exception=True):
#             #print('valid')
#             #access to field
#             serializer.validated_data['password'] = hashed_password

#             # Save the serializer instance to create a new User object
#             instance = serializer.save()
            
           
#             return Response(serializer.data)
        
        
#         return Response({"invalid":"not good data"}, status=400)
    
class SignupView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
    ):
    queryset = User.objects.all()
    serializer_class = UserSerializer

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


    
# class LoginView(APIView):
#     def get(self, request):
        
#         serializer = UserSerializer(data=request.data)

#         return Response(serializer.data)
    
#     def post(self, request):

#         serializer = UserSerializer(data=request.data)