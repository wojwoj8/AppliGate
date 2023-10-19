from rest_framework import serializers, exceptions
from django.core.files.uploadedfile import SimpleUploadedFile
from ..user_app.models import (
    User,
)
from datetime import datetime


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }