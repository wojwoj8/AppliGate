# for translating data to JSON
from rest_framework import serializers, exceptions
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import (
    User,
    UserExperience,
    UserEducation,
    UserCourse,
    UserSkill,
    UserLanguage,
    UserLink,
)
from datetime import datetime


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "user_type",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }


class ChangeUserDataSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "current_password",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def update(self, instance, validated_data):
        validated_data.pop(
            "current_password"
        )  # Remove current_password from validated_data
        return super().update(instance, validated_data)


class DeleteUserDataSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "current_password",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        current_password = data.get("current_password")
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")

        user = self.context["request"].user

        if not user.check_password(current_password):
            raise exceptions.ValidationError(
                {"current_password": "Current password is incorrect."}
            )

        if new_password != confirm_password:
            raise exceptions.ValidationError(
                {"confirm_password": "New passwords do not match."}
            )

        return data


class DateSerializer(serializers.Field):
    def to_internal_value(self, value):
        print(value)
        if self.field_name == "date_of_birth" and value == "":
            return None
        elif value == "":
            return None
        elif type(value) != str:
            raise serializers.ValidationError("Invalid date format. Use 'YYYY-MM-DD'.")
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError:
            raise serializers.ValidationError("Invalid date format. Use 'YYYY-MM-DD'.")

    def to_representation(self, value):
        if value == "":
            return None
        return value.strftime("%Y-%m-%d")


class ProfileSerializer(serializers.ModelSerializer):
    date_of_birth = DateSerializer(allow_null=True, required=False)
    profile_image = serializers.ImageField(required=False)

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

    def to_internal_value(self, data):
        if (
            "profile_image" in data
            and data["profile_image"] == "defaults/default_profile_image.jpg"
        ):
            data[
                "profile_image"
            ] = None  # Set it to None to represent the default image
        return super().to_internal_value(data)


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "contact_email",
            "phone_number",
        ]


class MonthYearDateField(serializers.Field):
    def to_internal_value(self, value):
        if self.field_name == "from_date" and value == "":
            raise serializers.ValidationError("This field may not be blank.")
        elif value == "":
            return None
        try:
            # Parse "YYYY-MM" formatted date string and add day component as 1
            return datetime.strptime(value + "-01", "%Y-%m-%d").date()
        except ValueError:
            raise serializers.ValidationError("Invalid date format. Use 'YYYY-MM'.")

    def to_representation(self, value):
        # Convert date object to "YYYY-MM" formatted string without the day component
        if value == "":
            return None
        return value.strftime("%Y-%m")


class UserExperienceSerializer(serializers.ModelSerializer):
    from_date = MonthYearDateField(required=True)
    to_date = MonthYearDateField(allow_null=True, required=False)

    class Meta:
        model = UserExperience
        fields = [
            "id",
            "position",
            "localization",
            "company",
            "from_date",
            "to_date",
            "responsibilities",
        ]
    def validate(self, data):
        from_date = data.get('from_date')
        to_date = data.get('to_date')

        if from_date and to_date and from_date > to_date:
            raise serializers.ValidationError({'from_date':["From date must be before or equal to to date."]})

        return data

class UserEducationSerializer(serializers.ModelSerializer):
    from_date = MonthYearDateField(required=True)
    to_date = MonthYearDateField(allow_null=True, required=False)

    class Meta:
        model = UserEducation
        fields = [
            "id",
            "school",
            "educational_level",
            "major",
            "specialization",
            "from_date",
            "to_date",
        ]
    def validate(self, data):
        from_date = data.get('from_date')
        to_date = data.get('to_date')

        if from_date and to_date and from_date > to_date:
            raise serializers.ValidationError({'from_date':["From date must be before or equal to to date."]})

        return data

class UserCourseSerializer(serializers.ModelSerializer):
    finish_date = MonthYearDateField(allow_null=True, required=False)

    class Meta:
        model = UserCourse
        fields = [
            "id",
            "course_name",
            "organizer",
            "certificate_link",
            "finish_date",
        ]


class UserSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSkill
        fields = ["id", "skill"]


class UserLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLanguage
        fields = ["id", "language", "language_level"]


class UserLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLink
        fields = ["id", "link_name", "link"]


class UserAboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["about_me"]


class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["professional_summary"]


# private/public
class UserProfileStatus(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["public_profile"]
