from rest_framework import serializers, exceptions
from django.core.files.uploadedfile import SimpleUploadedFile
from user_app.models import (
    User,
)
from user_app.serializer import (
    DateSerializer,
    ProfileSerializer,
    
    )
from datetime import datetime


class ProfileCompanySerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False)
    background_image = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = [
            "current_position",
            "first_name",
            "country",
            "city",
            "profile_image",
            "background_image",
        ]

    def to_internal_value(self, data):
        if (
            "profile_image" in data
            and data["profile_image"] == "defaults/default_profile_image.jpg"
        ):
            data[
                "profile_image"
            ] = None  # Set it to None to represent the default image
        elif (
            "background_image" in data
            and data["background_image"] == "defaults/default_background_image.png"
        ):
            data[
                "background_image"
            ] = None  # Set it to None to represent the default image
        return super().to_internal_value(data)
    
   