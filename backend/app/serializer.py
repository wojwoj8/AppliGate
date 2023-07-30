#for translating data to JSON
from rest_framework import serializers
from .models import User, UserExpirience

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'date_of_birth', 'first_name', 'last_name']
        # read_only_fields = ["id"]
        extra_kwargs = {
            'password': {'write_only': True},
        }
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['current_position', 'first_name', 'last_name', 'date_of_birth', 'country', 'city', 'email','phone_number']

class UserExpirienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExpirience
        fields = ['position', 'localization', 'company', 'from_date', 'to_date', 'responsibilities']
        # exclude = ('user',)