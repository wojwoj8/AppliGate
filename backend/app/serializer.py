#for translating data to JSON
from rest_framework import serializers
from .models import *

class ReactSerializer(serializers.ModelSerializer):
    class Meta:
        model = React
        fields = ('id', 'title', 'description', 'completed')