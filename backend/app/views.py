from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from . models import *
from . serializer import *
from rest_framework.response import Response

# Create your views here.

# class ReactView(viewsets.ModelViewSet):
#     serializer_class = ReactSerializer
#     queryset = React.objects.all()

class LoginView(APIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    def post(self, request):
        data = request.data
        print(data)
        print(request)
        return Response(data, status=status.HTTP_201_CREATED)