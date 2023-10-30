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
    JobListingsSerializer,
    JobOfferCompanySerializer,
    JobOfferTopSerializer,

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



class ProfileCompanyView(BaseProfileUpdateView):
    # permission_classes = [IsAuthenticated]
    serializer_class = ProfileCompanySerializer
    queryset = User.objects.all()


class JobOfferListingView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = JobOffer.objects.all()  # Define the queryset here
    serializer_class = JobListingsSerializer

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()  # You can also remove this line since queryset is defined
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class MyJobOffersListingView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobListingsSerializer

    def get(self, request, *args, **kwargs):
        queryset = JobOffer.objects.filter(company=self.request.user)
        job_offers = list(queryset)  # Convert the queryset to a list of instances
        print(job_offers)
        serializer = self.serializer_class(job_offers, many=True)
        return Response(serializer.data)

# class JobOfferSkills(generics.ListAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = JobListingsSerializer

#     def get(self, request, *args, **kwargs):
#         queryset = JobOffer.objects.filter(company=self.request.user)
#         job_offers = list(queryset)  # Convert the queryset to a list of instances
#         print(job_offers)
#         serializer = self.serializer_class(job_offers, many=True)
#         return Response(serializer.data)



# class JobOfferView(
#     generics.GenericAPIView,
#     mixins.ListModelMixin,
#     mixins.CreateModelMixin,
#     mixins.UpdateModelMixin,
#     mixins.DestroyModelMixin,
# ):
#     permission_classes = [IsAuthenticated]
#     serializer_class = None

#     def get(self, request, *args, **kwargs):
#         id = self.kwargs.get("id")
#         offer = get_object_or_404(JobOffer, id=id)
#         print(offer)
        
#         serializer = JobOfferCompanySerializer(offer, many=False)
#         return Response(serializer.data)
    
class BaseJobOfferView(
    generics.GenericAPIView,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    permission_classes = [IsAuthenticated]
    serializer_class = None
    queryset = None

    def get(self, request, *args, **kwargs):
        id = self.kwargs.get("id")
        offer = self.get_object(id)
        serializer = self.get_serializer(offer)
        return Response(serializer.data)

    def get_object(self, id):
        return get_object_or_404(self.queryset, id=id)

    def get_serializer(self, instance):
        if self.serializer_class:
            return self.serializer_class(instance, many=False)
        raise NotImplementedError("Serializer class is not defined.")
    
class JobOfferCompanyView(BaseJobOfferView):
    serializer_class = JobOfferCompanySerializer
    queryset = JobOffer.objects.all()

class JobOfferTopView(BaseJobOfferView):
    serializer_class = JobOfferTopSerializer
    queryset = JobOffer.objects.all()
    
