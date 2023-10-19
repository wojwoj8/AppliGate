from rest_framework import (
    viewsets,
    views,
    status,
    generics,
    mixins,
    authentication,
    permissions,
)
from rest_framework.exceptions import PermissionDenied
from ..user_app.models import (
    User
)
from .serializer import (
    UserSerializer,

)
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from rest_framework.generics import get_object_or_404
import os


class CompanySignupView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    

    def post(self, request, *args, **kwargs):
        user_types = [
        ('user', 'User'),
        ('company', 'Company'),
    ]
        password = request.data.get("password")
        confirm = request.data.get("confirm")

        if confirm != password:
            return Response({"invalid": "Passwords do not match"}, status=400)

        # hash that password
        hashed_password = make_password(password)
        request.data["password"] = hashed_password


        if request.data["user_type"] ==  None:
            request.data["user_type"] = 'user'
        print(request.data["user_type"])
        if not request.data["user_type"] or request.data["user_type"] not in user_types:
            return Response({"invalid": "Invalid user type"}, status=400)

        
        self.create(request, *args, **kwargs)
        return Response({"created": "Account created successfully"}, status=201)


class IndexView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer_class = UserSerializer(user, many=False)
        #print(serializer_class.data)
        return Response(serializer_class.data)