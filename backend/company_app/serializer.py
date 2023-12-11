from rest_framework import serializers, exceptions
from django.core.files.uploadedfile import SimpleUploadedFile
from user_app.models import (
    User,
)
from .models import (
    JobOfferSkill,
    JobOffer,
    JobOfferResponsibility,
    JobOfferRequirement,
    JobOfferWhatWeOffer,
    JobOfferApplication,
    JobApplication,
    JobApplicationExam,
    Question,
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


class JobAllListingsSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(source="company.profile_image")
    first_name = serializers.CharField(source="company.first_name")
    background_image = serializers.ImageField(source="company.background_image")
    country = serializers.CharField(source="company.country")
    city = serializers.CharField(source="company.city")

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
            "work_schedule",
            "work_mode",
            "salary_currency",
            "salary_type",
            "job_published_at",
            "job_application_deadline",
            "id",
            "recruitment_type",
            "position_level",
            "contract_type",
            "vacancy",
            "specialization",
            "city",
            "country",
        ]


class JobListingsSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(source="company.profile_image")
    first_name = serializers.CharField(source="company.first_name")
    background_image = serializers.ImageField(source="company.background_image")

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
            "work_schedule",
            "work_mode",
            "salary_currency",
            "salary_type",
            "job_published_at",
            "job_application_deadline",
            "id",
        ]


class JobUserAppliedListingsSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(source="company.profile_image")
    first_name = serializers.CharField(source="company.first_name")
    background_image = serializers.ImageField(source="company.background_image")

    # new fields for applicant_count and status
    applicant_count = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

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
            "work_schedule",
            "work_mode",
            "salary_currency",
            "salary_type",
            "job_published_at",
            "job_application_deadline",
            "id",
            "applicant_count",
            "status",
        ]

    def get_applicant_count(self, obj):
        return JobApplication.objects.filter(job_offer=obj.id).count()

    def get_status(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            job_application = JobApplication.objects.filter(
                job_offer=obj.id, applicant=request.user
            ).first()
            return job_application.status if job_application else None
        return None


class JobOfferDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = [
            "company",
            "id",
            "has_exam",
            "exam_pass_percentage",
        ]
# company data serializer (immutable for joboffer)
class JobOfferCompanySerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(source="company.profile_image")
    first_name = serializers.CharField(source="company.first_name")
    country = serializers.CharField(source="company.country")
    city = serializers.CharField(source="company.city")
    background_image = serializers.ImageField(source="company.background_image")
    username = serializers.CharField(source="company.username")

    class Meta:
        model = JobOffer
        fields = [
            "company",
            "id",
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

    def validate(self, data):
        salary_min = data.get("salary_min")
        salary_max = data.get("salary_max")

        if (
            salary_min is not None
            and salary_max is not None
            and salary_min >= salary_max
        ):
            raise serializers.ValidationError(
                {"salary_min": ["Minimum salary must be lower than maximum salary"]}
            )

        return data


class JobOfferSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOfferSkill
        fields = ["id", "skill", "skill_type"]


class JobOfferTopMoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = [
            "job_application_deadline",
            "recruitment_type",
            "job_location",
            "work_schedule",
            "position_level",
            "contract_type",
            "vacancy",
            "work_mode",
            "specialization",
        ]


class JobOfferTopColorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = [
            "svg_color",
            "background_color",
        ]


class JobOfferStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = ["job_offer_status"]


class JobOfferAboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = ["job_about"]


class JobOfferResponsibilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOfferResponsibility
        fields = ["id", "job_responsibility"]


class JobOfferRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOfferRequirement
        fields = [
            "id",
            "job_requirement",
        ]


class JobOfferWhatWeOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOfferWhatWeOffer
        fields = [
            "id",
            "job_whatweoffer",
        ]


class JobOfferApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOfferApplication
        fields = ["id", "job_application_stage"]


class JobOfferCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = "__all__"


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = "__all__"


class JobApplicationUserListingSerializer(serializers.ModelSerializer):
    job_offer = JobListingsSerializer()
    job_application = JobApplicationSerializer()

    class Meta:
        model = JobOffer
        fields = "__all__"


class UserProfileAssessSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "current_position",
            "first_name",
            "last_name",
            "date_of_birth",
            "country",
            "city",
            "profile_image",
        ]


class JobOfferAppliedForOfferListingSerializer(serializers.ModelSerializer):
    applicant = UserProfileAssessSerializer()
    title = serializers.CharField(source="job_offer.title")
    user_username = serializers.CharField(source="applicant.username")

    class Meta:
        model = JobApplication
        fields = ["id", "job_offer", "title", "applicant", "application_date", "status","user_username"]

class JobOfferAssessSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ["id","status",]

class JobApplicationExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplicationExam
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

