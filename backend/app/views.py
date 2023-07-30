from rest_framework import viewsets, status, generics, mixins, authentication, permissions
from .models import User
from .serializer import UserSerializer, ProfileSerializer
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password


from rest_framework.permissions import IsAuthenticated
from datetime import datetime
    
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
        self.create(request, *args, **kwargs)
        return Response({"created": "Account created successfully"}, status=200)

         
class IndexView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer_class = UserSerializer(user, many=False)
        return Response(serializer_class.data)
    
    def post(self, request, *args, **kwargs):
        username = kwargs.get('username')
        if username is not None:
            return self.retrieve(request, *args, **kwargs)
        

class ProfileView(
    generics.GenericAPIView,
    mixins.UpdateModelMixin):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer_class = ProfileSerializer(user, many=False)
        return Response(serializer_class.data)

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer_class = ProfileSerializer(user, data=request.data)

        # Handle date format
        date = request.data['date_of_birth']
        date_object = datetime.fromisoformat(date[:-1])  # Remove the "Z" at the end
        request.data['date_of_birth'] = date_object.strftime('%Y-%m-%d')
        print(request.data)
        if serializer_class.is_valid():
            serializer_class.save()
            return Response(serializer_class.data)
        return Response(serializer_class.errors, status=400)