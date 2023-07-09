from django.shortcuts import render
from rest_framework import viewsets
from . models import *
from . serializer import *
from rest_framework.response import Response

# Create your views here.

class ReactView(viewsets.ModelViewSet):
    serializer_class = ReactSerializer
    queryset = React.objects.all()