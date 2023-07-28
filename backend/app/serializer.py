#for translating data to JSON
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'date_of_birth', 'first_name', 'last_name']
        # read_only_fields = ["id"]
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'date_of_birth', 'country', 'city']