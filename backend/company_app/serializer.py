from rest_framework import serializers, exceptions
from django.core.files.uploadedfile import SimpleUploadedFile
from user_app.models import (
    User,
)
from .models import (
    JobOfferSkills,
    JobOffer,
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
    
class JobListingsSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(source='company.profile_image')
    first_name = serializers.CharField(source='company.first_name')
    background_image = serializers.ImageField(source='company.background_image')
    

    class Meta:
        model = JobOffer
        fields = [
            "profile_image",
            "first_name",
            "background_image",
            "title",
            "job_location",
            "salary_min",
            "salary_max",
            "job_description",
            "salary_currency",
            "job_published_at",
            "job_application_deadline",
            "id",
        ]