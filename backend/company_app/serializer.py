from rest_framework import serializers, exceptions
from django.core.files.uploadedfile import SimpleUploadedFile
from user_app.models import (
    User,
)
from .models import (
    JobOfferSkill,
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
            "job_type",
            "salary_currency",
            "salary_type",
            "job_published_at",
            "job_application_deadline",
            "id",
        ]

# company data serializer (immutable for joboffer)
class JobOfferCompanySerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(source='company.profile_image')
    first_name = serializers.CharField(source='company.first_name')
    country = serializers.CharField(source='company.country')
    city = serializers.CharField(source='company.city')
    background_image = serializers.ImageField(source='company.background_image')
    username = serializers.CharField(source='company.username')
    

    class Meta:
        model = JobOffer
        fields = [
            "username",
            "profile_image",
            "first_name",
            "background_image",
            "country",
            "city",
        ]

class JobOfferTopSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = [
            "title",
            "salary_min",
            "salary_max",
            "salary_currency",
            "salary_type",
            
        ]

class JobOfferSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOfferSkill
        fields = ["id", "skill"]