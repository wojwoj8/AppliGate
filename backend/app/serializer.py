# for translating data to JSON
from rest_framework import serializers
from .models import User, UserExperience
from datetime import datetime


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "password",
            "email",
            "date_of_birth",
            "first_name",
            "last_name",
        ]
        # read_only_fields = ["id"]
        extra_kwargs = {
            "password": {"write_only": True},
        }


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "current_position",
            "first_name",
            "last_name",
            "date_of_birth",
            "country",
            "city",
        ]


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "contact_email",
            "phone_number",
        ]


class MonthYearDateField(serializers.Field):
    def to_internal_value(self, value):
        # print(value)
        if value == "":
            raise serializers.ValidationError("This field may not be blank.")
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


class UserEducationSerializer(serializers.ModelSerializer):
    from_date = MonthYearDateField(required=True)
    to_date = MonthYearDateField(allow_null=True, required=False)

    class Meta:
        model = UserExperience
        fields = [
            "id",
            "school",
            "educational_level",
            "major",
            "specialization",
            "from_date",
            "to_date",
        ]
