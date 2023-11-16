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
    User,
)
from .serializer import (
    ProfileCompanySerializer,
    JobListingsSerializer,
    JobOfferCompanySerializer,
    JobOfferTopSerializer,
    JobOfferTopMoreSerializer,
    JobOfferSkillSerializer,
    JobOfferTopColorsSerializer,
    JobOfferStatusSerializer,
    JobOfferAboutSerializer,
    JobOfferResponsibilitySerializer,
    JobOfferRequirementSerializer,
    JobOfferWhatWeOfferSerializer,
    JobOfferApplicationSerializer,

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
from .models import (
    JobOffer,
    JobOfferSkill,
    JobOfferResponsibility,
    JobOfferRequirement,
    JobOfferWhatWeOffer,
    JobOfferApplication,
)


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
    serializer_class = JobListingsSerializer

    def get_queryset(self):
        return JobOffer.objects.filter(job_offer_status=True)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class MyJobOffersListingView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobListingsSerializer

    def get(self, request, *args, **kwargs):
        queryset = JobOffer.objects.filter(company=self.request.user)
        job_offers = list(queryset)  # Convert the queryset to a list of instances
        # print(job_offers)
        serializer = self.serializer_class(job_offers, many=True)
        return Response(serializer.data)

class JobOfferDeleteOfferView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = JobOffer.objects.all()

    def check_joboffer_owner(self, request, instance):
        owner_id = instance.company.id
        if request.user.id != owner_id:
            raise PermissionDenied("You do not have permission to perform this action.")
        elif JobOffer.DoesNotExist:
            return Response({"detail": "JobOffer not found"}, status=status.HTTP_404_NOT_FOUND)

    def perform_destroy(self, instance):
        self.check_joboffer_owner(self.request, instance)
        instance.delete()

    
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

    def check_joboffer_status(self, request):
        id = self.kwargs.get("id")
        try:
            job_offer = JobOffer.objects.get(id=id)
            owner_id = job_offer.company.id
            if request.user.id != owner_id and not job_offer.job_offer_status:
                raise PermissionDenied("This JobOffer is not listed.")
        except JobOffer.DoesNotExist:
            return Response({"detail": "JobOffer not found"}, status=status.HTTP_404_NOT_FOUND)
        
        
    def get_object(self, id):
        return get_object_or_404(self.queryset, id=id)

    def get(self, request, *args, **kwargs):
        
        self.check_joboffer_status(request)
        id = self.kwargs.get("id")
        
        offer = self.get_object(id)
        serializer = self.get_serializer(offer)
        # print(serializer.data)
        return Response(serializer.data)

    def get_serializer(self, instance):
        if self.serializer_class:
            return self.serializer_class(instance, many=False)
        raise NotImplementedError("Serializer class is not defined.")

    def put(self, request, *args, **kwargs):
        self.check_joboffer_owner(request)
        print(request.data)
        id = self.kwargs.get("id")
        offer = self.get_object(id)
        serializer = self.serializer_class(offer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, *args, **kwargs):
        self.check_joboffer_owner(request)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class JobOfferCompanyView(BaseJobOfferView):
    serializer_class = JobOfferCompanySerializer
    queryset = JobOffer.objects.all()
    permission_classes = [IsAuthenticated]

class JobOfferTopView(BaseJobOfferView):
    serializer_class = JobOfferTopSerializer
    queryset = JobOffer.objects.all()
    permission_classes = [IsAuthenticated]

class JobOfferTopMoreView(BaseJobOfferView):
    serializer_class = JobOfferTopMoreSerializer
    queryset = JobOffer.objects.all()
    permission_classes = [IsAuthenticated]

class JobOfferTopColorsView(BaseJobOfferView):
    serializer_class = JobOfferTopColorsSerializer
    queryset = JobOffer.objects.all()
    permission_classes = [IsAuthenticated]

class JobOfferStatusView(BaseJobOfferView):
    serializer_class = JobOfferStatusSerializer
    queryset = JobOffer.objects.all()
    permission_classes = [IsAuthenticated]

class JobOfferAboutView(BaseJobOfferView):
    serializer_class = JobOfferAboutSerializer
    queryset = JobOffer.objects.all()
    permission_classes = [IsAuthenticated]
    


class BaseJobOfferMultipleView(
    generics.GenericAPIView,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    permission_classes = [IsAuthenticated]
    serializer_class = None
    queryset = None

    def check_joboffer_owner(self, request):
        id = self.kwargs.get("id")
        item_id = self.kwargs.get("item_id")
        
        #check if user is owner
        try:
            if id:
                job_offer = JobOffer.objects.get(id=id)
                owner_id = job_offer.company.id
                if request.user.id != owner_id:
                    raise PermissionDenied("You do not have permission to perform this action.")
            # check if item owner is related to user
            if item_id:
                item = self.queryset.get(id=item_id)
                if item.job_offer.company != request.user:
                    raise PermissionDenied("You do not have permission to perform this action.")
                
        except JobOffer.DoesNotExist:
            return Response({"detail": "JobOffer not found"}, status=status.HTTP_404_NOT_FOUND)
        
    def get_queryset(self):
        job_offer_id = self.kwargs.get("id") 
        if job_offer_id:
            return self.queryset.filter(job_offer__id=job_offer_id)
        # return self.queryset.all() 

    def get(self, request, *args, **kwargs):
        # print(request.__dict__)
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
       
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        self.check_joboffer_owner(request)
        offer_id = kwargs.get('id')
        print(offer_id)
        
        try:
            job_offer = JobOffer.objects.get(id=offer_id)
        except JobOffer.DoesNotExist:
            return Response({'error': 'JobOffer not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.data is None:
            serializer = self.serializer_class(data={})
        else:
            serializer = self.serializer_class(data=request.data)
            
        if serializer.is_valid():
            serializer.save(job_offer=job_offer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, *args, **kwargs):
        self.check_joboffer_owner(request)
        item_id = kwargs.get('item_id')
        
        
        try:
            instance = self.queryset.get(id=item_id)
        except JobOffer.DoesNotExist:
            print('test')
            return Response({'error': 'JobOffer not found'}, status=status.HTTP_404_NOT_FOUND)
        

        serializer = self.serializer_class(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        self.check_joboffer_owner(request)
        skill_id = self.kwargs.get("item_id")

        try:
            instance = self.queryset.get(id=skill_id)
        except self.serializer_class.Meta.model.DoesNotExist:
            return Response(
                {"error": f"{self.serializer_class.Meta.model.__name__} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        instance.delete()
        return Response(
            {
                "deleted": f"{self.serializer_class.Meta.model.__name__} deleted successfully"
            },
            status=200,
        )



class JobOfferSkillView(BaseJobOfferMultipleView):
    serializer_class = JobOfferSkillSerializer
    queryset = JobOfferSkill.objects.all()
    permission_classes = [IsAuthenticated]

class JobOfferResponsibilityView(BaseJobOfferMultipleView):
    serializer_class = JobOfferResponsibilitySerializer
    queryset = JobOfferResponsibility.objects.all()
    permission_classes = [IsAuthenticated]

class JobOfferRequirementView(BaseJobOfferMultipleView):
    serializer_class = JobOfferRequirementSerializer
    queryset = JobOfferRequirement.objects.all()
    permission_classes = [IsAuthenticated]

class JobOfferWhatWeOfferView(BaseJobOfferMultipleView):
    serializer_class = JobOfferWhatWeOfferSerializer
    queryset = JobOfferWhatWeOffer.objects.all()
    permission_classes = [IsAuthenticated]
    
class JobOfferApplicationView(BaseJobOfferMultipleView):
    serializer_class = JobOfferApplicationSerializer
    queryset = JobOfferApplication.objects.all()
    permission_classes = [IsAuthenticated]