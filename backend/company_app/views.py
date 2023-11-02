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



class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a job offer to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the job offer.
        return obj.company == request.user


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

    # check if request.user is owner
    def check_joboffer_owner(self, request):
        id = self.kwargs.get("id")
        try:
            job_offer = JobOffer.objects.get(id=id)
            owner_id = job_offer.company.id
            if request.user.id != owner_id:
                raise PermissionDenied("You do not have permission to perform this action.")
        except JobOffer.DoesNotExist:
            return Response({"detail": "JobOffer not found"}, status=status.HTTP_404_NOT_FOUND)

    def get_object(self, id):
        return get_object_or_404(self.queryset, id=id)

    
    def get_serializer(self, instance):
        if self.serializer_class:
            return self.serializer_class(instance, many=False)
        raise NotImplementedError("Serializer class is not defined.")

    def put(self, request, *args, **kwargs):
        self.check_joboffer_owner(request)
        # print(request.__dict__)
        id = self.kwargs.get("id")
        offer = self.get_object(id)
        serializer = self.serializer_class(offer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class JobOfferCompanyView(BaseJobOfferView):
    serializer_class = JobOfferCompanySerializer
    queryset = JobOffer.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

class JobOfferTopView(BaseJobOfferView):
    serializer_class = JobOfferTopSerializer
    queryset = JobOffer.objects.all()
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
