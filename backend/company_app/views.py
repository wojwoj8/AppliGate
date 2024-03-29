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
    JobUserAppliedListingsSerializer,
    JobAllListingsSerializer,
    JobOfferAppliedForOfferListingSerializer,
    JobOfferAssessSerializer,
    JobOfferDataSerializer,
    QuestionSerializer,
    JobApplicationExamSerializer,

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
    JobApplicationExam,
    Question
)
from datetime import datetime, timedelta
from rest_framework.pagination import PageNumberPagination
from django.db.models import F, Max, Case, When, Value
from django.db import models


class JobOfferAssessView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobOfferAssessSerializer

    def put(self, request, *args, **kwargs):
        
        offer_id = self.kwargs.get('offer_id')
        username = self.kwargs.get('username')
        user = request.user
   
        job_offer = get_object_or_404(JobApplication, job_offer=offer_id, job_offer__company=user ,applicant__username=username)

        serializer = self.serializer_class(job_offer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class JobOfferAppliedForOfferListingView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobOfferAppliedForOfferListingSerializer
    pagination_class = PageNumberPagination

    def get(self, request, *args, **kwargs):
        job_offer_id = kwargs.get("offer_id")

        job_offer = get_object_or_404(JobOffer, id=job_offer_id)
        # print(job_offer)

        queryset = JobApplication.objects.filter(job_offer=job_offer).order_by(
            Case(
                When(status="pending", then=0),
                When(status="approved", then=1),
                When(status="rejected", then=2),
                default=3,  
                output_field=models.IntegerField(),
            )
        )

        self.pagination_class.page_size = 20
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.serializer_class(page, many=True)

            return self.get_paginated_response(serializer.data)

        return Response({"detail": "Invalid page"}, status=status.HTTP_404_NOT_FOUND)


class ProfileCompanyView(BaseProfileUpdateView):
    # permission_classes = [IsAuthenticated]
    serializer_class = ProfileCompanySerializer
    queryset = User.objects.all()


class JobOfferListingView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobAllListingsSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        now = datetime.now().date()

        return JobOffer.objects.filter(
            job_application_deadline__gt=now,
            job_offer_status=True,
            company__public_profile=True,
        ).order_by("-job_published_at")
    
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        self.pagination_class.page_size = 3
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.serializer_class(page, many=True)

            for job_offer_data in serializer.data:
                job_offer_id = job_offer_data["id"]

                skills = JobOfferSkill.objects.filter(
                    job_offer_id=job_offer_id, skill_type="required"
                )
                skill_data = JobOfferSkillSerializer(skills, many=True).data

                job_offer_data["skills"] = skill_data

                job_offer_data["applicant_count"] = JobApplication.objects.filter(
                    job_offer_id=job_offer_id
                ).count()

            return self.get_paginated_response(serializer.data)

        return Response({"detail": "Invalid page"}, status=status.HTTP_404_NOT_FOUND)


class JobOfferUserAppliedListingView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobUserAppliedListingsSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        user = self.request.user

        applied_job_offers = (
            JobApplication.objects.filter(
                applicant=user,
                # job_offer__job_offer_status=True,
                # job_offer__company__public_profile=True,
            )
            .values_list("job_offer_id", flat=True)
            .distinct()
        )

        queryset = (
            JobOffer.objects.filter(id__in=applied_job_offers)
            .annotate(latest_application_date=Max("applications__application_date"))
            .order_by(F("latest_application_date"))
        )

        return queryset

    def get_paginated_response(self, data):
        return self.paginator.get_paginated_response(data)

    def get(self, request, *args, **kwargs):
        # page_number = int(kwargs.get("page", 1))
        self.pagination_class.page_size = 3
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        # print(page)
        if page is not None:
            serializer = self.serializer_class(
                page, many=True, context={"request": request}
            )
            # print(self.get_paginated_response(serializer.data))
            return self.get_paginated_response(serializer.data)

        return Response({"detail": "Invalid page"}, status=status.HTTP_404_NOT_FOUND)


class MyJobOffersListingView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = JobListingsSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        return JobOffer.objects.filter(company=self.request.user).order_by(
            "job_published_at"
        )
    
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if "username" in kwargs:
            user = get_object_or_404(User, username=kwargs.get("username"))
            # print(kwargs.get("username"))
            queryset = JobOffer.objects.filter(company=user, job_offer_status=True).order_by("-job_published_at")[:3]
            
            job_offers = list(queryset)
            # print(job_offers)
            serializer = self.serializer_class(job_offers, many=True)
            data = serializer.data
            for job_offer_data in data:
                job_offer_id = job_offer_data["id"]
                job_offer_data["applicant_count"] = JobApplication.objects.filter(
                    job_offer_id=job_offer_id
                ).count()

            return Response(data)
        else:
            self.pagination_class.page_size = 3
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = self.serializer_class(page, many=True)
                # job_offers = list(queryset)
                # print(job_offers)
                # serializer = self.serializer_class(job_offers, many=True)
                data = serializer.data
                for job_offer_data in data:
                    job_offer_id = job_offer_data["id"]
                    job_offer_data["applicant_count"] = JobApplication.objects.filter(
                        job_offer_id=job_offer_id
                    ).count()

                return self.get_paginated_response(serializer.data)

            return Response(
                {"detail": "Invalid page"}, status=status.HTTP_404_NOT_FOUND
            )


class JobOfferDeleteOfferView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = JobOffer.objects.all()

    def check_joboffer_owner(self, request, instance):
        owner_id = instance.company.id
        if request.user.id != owner_id:
            raise PermissionDenied("You do not have permission to perform this action.")
        elif JobOffer.DoesNotExist:
            return Response(
                {"detail": "JobOffer not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def perform_destroy(self, instance):
        self.check_joboffer_owner(self.request, instance)
        instance.delete()


class JobOfferCreateOfferView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = JobOffer.objects.all()
    serializer_class = JobOfferCreateSerializer

    def check_user(self, request):
        user_type = request.user.user_type
        if user_type != "company":
            raise PermissionDenied("You do not have permission to perform this action.")

    def post(self, request, *args, **kwargs):
        self.check_user(request)
        deadline = (datetime.now() + timedelta(days=7)).date()
        default_data = {
            "title": "Title",
            "job_location": "Location",
            "work_schedule": "Schedule",
            "position_level": "Position Level",
            "contract_type": "Contract Type",
            "specialization": "Specialization",
            "salary_min": 10,
            "salary_max": 100,
            "vacancy": "One vacancy",
            "work_mode": "Home office work",
            "job_application_deadline": deadline,
            "company": request.user.id,
        }

        default_data.update(request.data)

        serializer = self.get_serializer(data=default_data)

        if serializer.is_valid():
            job_offer = serializer.save(company=request.user)
            return Response(
                {
                    "created": "Job Offer created successfully",
                    "job_offer_id": job_offer.id,
                },
                status=status.HTTP_201_CREATED,
            )

        # print(serializer.errors)
        return Response(
            {"error": "Error creating job offer"}, status=status.HTTP_400_BAD_REQUEST
        )


# check if joboffer is public and if profilie that listed is public and if date is valid datenow check?
class JobApplicationView(generics.CreateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer

    def check_user(self, request):
        user_type = request.user.user_type
        if user_type != "user":
            raise PermissionDenied("Company user can't apply for an offer!")

    def get(self, request, *args, **kwargs):
        job_offer_id = kwargs.get("id")
        job_offer = JobOffer.objects.get(id=job_offer_id)
        applicant = request.user

        # Check if the user has already applied for the specified job offer
        has_applied = JobApplication.objects.filter(
            job_offer=job_offer, applicant=applicant
        ).exists()

        return Response({"has_applied": has_applied})

    def create(self, request, *args, **kwargs):
        self.check_user(request)
        job_offer_id = kwargs.get("id")
        job_offer = JobOffer.objects.get(id=job_offer_id)
        status = job_offer.job_offer_status
        if status is False:
            raise PermissionDenied("That offer is not listed!")

        if job_offer.job_application_deadline < datetime.now().date():
            raise PermissionDenied(
                "The deadline for applying to this offer has passed!"
            )

        applicant = request.user
        data = {"job_offer": job_offer.id, "applicant": applicant.id}
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
                raise PermissionDenied(
                    "You do not have permission to perform this action."
                )
        except JobOffer.DoesNotExist:
            return Response(
                {"detail": "JobOffer not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def check_joboffer_status(self, request):
        id = self.kwargs.get("id")
        try:
            job_offer = JobOffer.objects.get(id=id)
            job_application = JobApplication.objects.filter(
                job_offer=job_offer, applicant=request.user
            ).first()
            owner_id = job_offer.company.id
            # if user applied for that offer make it visible
            if job_application is not None:
                return
            if request.user.id != owner_id and not job_offer.job_offer_status:
                raise PermissionDenied("This JobOffer is not listed.")
        except JobOffer.DoesNotExist:
            return Response(
                {"detail": "JobOffer not found"}, status=status.HTTP_404_NOT_FOUND
            )

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


class JobOfferDataView(BaseJobOfferView):
    serializer_class = JobOfferDataSerializer
    queryset = JobOffer.objects.all()
    permission_classes = [IsAuthenticated]

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

        # check if user is owner
        try:
            if id:
                job_offer = JobOffer.objects.get(id=id)
                owner_id = job_offer.company.id
                if request.user.id != owner_id:
                    raise PermissionDenied(
                        "You do not have permission to perform this action."
                    )
            # check if item owner is related to user
            if item_id:
                item = self.queryset.get(id=item_id)
                if item.job_offer.company != request.user:
                    raise PermissionDenied(
                        "You do not have permission to perform this action."
                    )

        except JobOffer.DoesNotExist:
            return Response(
                {"detail": "JobOffer not found"}, status=status.HTTP_404_NOT_FOUND
            )

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
        offer_id = kwargs.get("id")
        # print(offer_id)

        try:
            job_offer = JobOffer.objects.get(id=offer_id)
        except JobOffer.DoesNotExist:
            return Response(
                {"error": "JobOffer not found"}, status=status.HTTP_404_NOT_FOUND
            )

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
        item_id = kwargs.get("item_id")

        try:
            instance = self.queryset.get(id=item_id)
        except JobOffer.DoesNotExist:
            # print('test')
            return Response(
                {"error": "JobOffer not found"}, status=status.HTTP_404_NOT_FOUND
            )

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


class JobOfferExamView(
    generics.GenericAPIView,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin):

    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    def get_queryset(self):
        job_offer_id = self.kwargs['id']
        return Question.objects.filter(job_offer_id=job_offer_id)

    def get(self, request, *args, **kwargs):
        job_offer_id = self.kwargs['id']
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
   
        
    def perform_create(self, serializer):
        # Ensure that the job_offer field is set to the correct JobOffer instance
        job_offer_id = self.request.data.get('job_offer')
        job_offer = JobOffer.objects.get(pk=job_offer_id)
        serializer.save(job_offer=job_offer)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def put(self, request, *args, **kwargs):
        item_id = request.data.get("id")
        
        try:
            instance = self.queryset.get(id=item_id)

        except self.serializer_class.Meta.model.DoesNotExist:
            return Response(
                {"error": f"{self.serializer_class.Meta.model.__name__} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.serializer_class(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, *args, **kwargs):
        item_id = kwargs.get("id")
        
        try:
            instance = self.queryset.get(id=item_id)
            
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except self.serializer_class.Meta.model.DoesNotExist:
            return Response(
                {"error": f"{self.serializer_class.Meta.model.__name__} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

class JobOfferPassPercentageView(
    generics.GenericAPIView,
    mixins.UpdateModelMixin,):

    serializer_class = JobOfferDataSerializer
    queryset = JobOffer.objects.all()

    def put(self, request, *args, **kwargs):
        offer_id = request.data.get("id")
        
        try:
            instance = self.queryset.get(id=offer_id)

        except self.serializer_class.Meta.model.DoesNotExist:
            return Response(
                {"error": f"{self.serializer_class.Meta.model.__name__} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.serializer_class(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, *args, **kwargs):
        job_offer_id = self.kwargs['id']
        # to change job offer has exam and pass percentage
        job_offer = JobOffer.objects.get(pk=job_offer_id)
        job_offer.has_exam = False
        job_offer.exam_pass_percentage = 50  
        job_offer.save()

        questions_to_delete = Question.objects.filter(job_offer_id=job_offer_id)
        questions_to_delete.delete()
        return Response({"message": "Questions deleted successfully"})
    
# application through exam
class JobOfferExamApplicationView(generics.CreateAPIView):

    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationExamSerializer

    def check_user(self, request):
        user_type = request.user.user_type
        if user_type != "user":
            raise PermissionDenied("Company user can't apply for an offer!")

    def get(self, request, *args, **kwargs):
        job_offer_id = kwargs.get("id")
        job_offer = JobOffer.objects.get(id=job_offer_id)
        applicant = request.user

        # Check if the user has already applied for the specified job offer
        has_applied = JobApplication.objects.filter(
            job_offer=job_offer, applicant=applicant
        ).exists()

        return Response({"has_applied": has_applied})

    def create(self, request, *args, **kwargs):
        self.check_user(request)
        job_offer_id = kwargs.get("id")
        job_offer = JobOffer.objects.get(id=job_offer_id)
        status = job_offer.job_offer_status
        if status is False:
            raise PermissionDenied("That offer is not listed!")

        if job_offer.job_application_deadline < datetime.now().date():
            raise PermissionDenied("The deadline for applying to this offer has passed!")

        applicant = request.user
        # Check if the user has already applied for the specified job offer
        has_applied = JobApplication.objects.filter(
            job_offer=job_offer, applicant=applicant
        ).exists()

        if has_applied:
            raise PermissionDenied("You have already applied for this job offer!")
        
        
        data = {"job_offer": job_offer.id, "applicant": applicant.id}

        # Include exam answers in the data
        exam_answers_data = request.data.get("answers")
        if exam_answers_data:
            data["answers"] = exam_answers_data

        # Create and save the JobApplication instance
        job_application_serializer = JobApplicationSerializer(data=data)
        if job_application_serializer.is_valid():
            job_application = job_application_serializer.save()

            # Check the correctness of the answers and calculate the score
            if exam_answers_data:
                question_ids = Question.objects.filter(job_offer=job_offer).values_list("id", flat=True)
                correct_answers = Question.objects.filter(id__in=question_ids).values_list(
                    "id", "correct_choice"
                )

                correct_count = 0
                for question_id, user_answer in zip(question_ids, exam_answers_data):
                    correct_choice = next(
                        choice for q_id, choice in correct_answers if q_id == question_id
                    )
                    if user_answer == correct_choice:
                        correct_count += 1

                # Calculate the score as a percentage
                total_questions = len(question_ids)
                score_percentage = (correct_count / total_questions) * 100

                # Save the JobApplicationExam instance with the calculated score
                job_application_exam = JobApplicationExam.objects.create(
                    application=job_application,
                    answers=exam_answers_data,
                    score=score_percentage,
                )
                
                if score_percentage >= job_offer.exam_pass_percentage:
                    job_application.status = "approved"
                else:
                    job_application.status = "rejected"
                job_application.exam_answers = job_application_exam
                job_application.save()

            else:
                # If no exam answers provided, create JobApplicationExam with score 0
                job_application_exam = JobApplicationExam.objects.create(
                    application=job_application,
                    answers=[],
                    score=0,
                )
                job_application.exam_answers = job_application_exam
                job_application.status = "rejected"
                job_application.save()

            return Response(job_application_serializer.data, status=201)
        return Response(job_application_serializer.errors, status=400)  