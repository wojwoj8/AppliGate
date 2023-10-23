from rest_framework import (
    viewsets,
    views,
    status,
    generics,
    mixins,
    authentication,
    permissions,
)
from rest_framework.exceptions import PermissionDenied
from user_app.models import (
    User
)
from .serializer import (
    ProfileCompanySerializer,

)
from user_app.views import (
    ProfileImageUploadView,
    BaseProfileView,
    BaseProfileUpdateView,
    )
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from rest_framework.generics import get_object_or_404
import os
from .models import JobOffer
from .serializer import JobListingsSerializer


class ProfileCompanyView(BaseProfileUpdateView):
    serializer_class = ProfileCompanySerializer
    queryset = User.objects.all()


class JobOfferListing(generics.ListAPIView):
    queryset = JobOffer.objects.all()  # Define the queryset here
    serializer_class = JobListingsSerializer

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()  # You can also remove this line since queryset is defined
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)