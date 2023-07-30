from rest_framework import viewsets, status, generics, mixins, authentication, permissions
from .models import User, UserExpirience
from .serializer import UserSerializer, ProfileSerializer, UserExpirienceSerializer
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
    
    # def post(self, request, *args, **kwargs):
    #     username = kwargs.get('username')
    #     if username is not None:
    #         return self.retrieve(request, *args, **kwargs)
        

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
    

class ProfileExpirienceView(
    generics.GenericAPIView,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin):
    permission_classes = [IsAuthenticated]
    queryset = UserExpirience.objects.all()
    serializer_class = UserExpirienceSerializer

    def get(self, request, *args, **kwargs):
        user = self.request.user
        queryset = UserExpirience.objects.filter(user=user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        print(request.data)
        return Response({"created": "Expirience added successfully"}, status=200)
    
    def put(self, request, *args, **kwargs):
        user = request.user
        serializer_class = UserExpirienceSerializer(user, data=request.data)

        # Handle date format
        # date = request.data['date_of_birth']
        # date_object = datetime.fromisoformat(date[:-1])  # Remove the "Z" at the end
        # request.data['date_of_birth'] = date_object.strftime('%Y-%m-%d')
        print(request.data)
        if serializer_class.is_valid():
            serializer_class.save()
            return Response(serializer_class.data)
        return Response(serializer_class.errors, status=400)