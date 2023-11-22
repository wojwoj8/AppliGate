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
    JobOfferCreateSerializer,
    JobApplicationSerializer,
    JobApplicationUserListingSerializer,

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
    JobApplication,
)
from datetime import datetime, timedelta



class ProfileCompanyView(BaseProfileUpdateView):
    # permission_classes = [IsAuthenticated]
    serializer_class = ProfileCompanySerializer
    queryset = User.objects.all()


class JobOfferListingView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobListingsSerializer

    def get_queryset(self):
        now = datetime.now().date()

        return JobOffer.objects.filter(
            job_application_deadline__gte=now,
            job_offer_status=True, 
            company__public_profile=True).order_by('-job_published_at')

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        data = serializer.data
        for job_offer_data in data:
            job_offer_id = job_offer_data['id']
            job_offer_data['applicant_count'] = JobApplication.objects.filter(
                job_offer_id=job_offer_id
            ).count()

        return Response(data)


class JobOfferUserAppliedListingView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobListingsSerializer

    def get_queryset(self):
        user = self.request.user
 
        applied_job_offers = JobApplication.objects.filter(
            applicant=user,
            job_offer__job_offer_status=True,
            job_offer__company__public_profile=True
        ).values_list('job_offer_id', flat=True)

        queryset = JobOffer.objects.filter(id__in=applied_job_offers)
        # order descending by application_date (on top lastly applied)
        queryset = queryset.order_by('-jobapplication__application_date')

        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        data = serializer.data
        for job_offer_data in data:
            job_offer_id = job_offer_data['id']
            job_offer_data['applicant_count'] = JobApplication.objects.filter(
                job_offer_id=job_offer_id
            ).count()

        return Response(data)


class MyJobOffersListingView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobListingsSerializer

    def get(self, request, *args, **kwargs):
        # print(kwargs.get("username"))
        if "username" in kwargs:
            user = get_object_or_404(User, username=kwargs.get("username"))
            # print(kwargs.get("username"))
            queryset = JobOffer.objects.filter(company=user, job_offer_status=True)
            job_offers = list(queryset)
            serializer = self.serializer_class(job_offers, many=True)
            data = serializer.data
            for job_offer_data in data:
                job_offer_id = job_offer_data['id']
                job_offer_data['applicant_count'] = JobApplication.objects.filter(
                    job_offer_id=job_offer_id
                ).count()

            return Response(data)
        else:
            queryset = JobOffer.objects.filter(company=self.request.user).order_by('-job_published_at')
            job_offers = list(queryset)  # Convert the queryset to a list of instances
            # print(job_offers)
            serializer = self.serializer_class(job_offers, many=True)
            data = serializer.data
            for job_offer_data in data:
                job_offer_id = job_offer_data['id']
                job_offer_data['applicant_count'] = JobApplication.objects.filter(
                    job_offer_id=job_offer_id
                ).count()

            return Response(data)

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

class JobOfferCreateOfferView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = JobOffer.objects.all()
    serializer_class = JobOfferCreateSerializer

    def check_user(self, request):
        user_type = request.user.user_type
        if user_type != 'company':
            raise PermissionDenied("You do not have permission to perform this action.")
        

    def post(self, request, *args, **kwargs):
        self.check_user(request)
        deadline = (datetime.now() + timedelta(days=7)).date()
        default_data = {
            'title': 'Title',
            'job_description': 'Description',
            'job_location': 'Location',
            'work_schedule': 'Schedule',
            'position_level': 'Position Level',
            'contract_type': 'Contract Type',
            'specialization': 'Specialization',
            'salary_min': 10,
            'salary_max': 100,
            'job_application_deadline': deadline,
            'company': request.user.id,
        }
        
        default_data.update(request.data)
        
        serializer = self.get_serializer(data=default_data)
        
        if serializer.is_valid():
            job_offer = serializer.save(company=request.user)
            return Response({"created": "Job Offer created successfully", "job_offer_id": job_offer.id}, status=status.HTTP_201_CREATED)
        
        # print(serializer.errors)
        return Response({"error": "Error creating job offer"}, status=status.HTTP_400_BAD_REQUEST)



# check if joboffer is public and if profilie that listed is public and if date is valid datenow check?
class JobApplicationView(generics.CreateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer

    def check_user(self, request):
        user_type = request.user.user_type
        if user_type != 'user':
            raise PermissionDenied("Company user can't apply for an offer!")

    def get(self, request, *args, **kwargs):
        job_offer_id = kwargs.get('id')
        job_offer = JobOffer.objects.get(id=job_offer_id)
        applicant = request.user

        # Check if the user has already applied for the specified job offer
        has_applied = JobApplication.objects.filter(job_offer=job_offer, applicant=applicant).exists()

        return Response({'has_applied': has_applied})

    def create(self, request, *args, **kwargs):
        self.check_user(request)
        job_offer_id = kwargs.get('id')
        job_offer = JobOffer.objects.get(id=job_offer_id)
        status = job_offer.job_offer_status
        if status is False:
            raise PermissionDenied("That offer is not listed!")
        
        if job_offer.job_application_deadline < datetime.now().date():
            raise PermissionDenied("The deadline for applying to this offer has passed!")
        
        applicant = request.user
        data = {'job_offer': job_offer.id, 'applicant': applicant.id}
        serializer = self.get_serializer(data=data)

        

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        # print(request.data)
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
        # print(offer_id)
        
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
            # print('test')
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