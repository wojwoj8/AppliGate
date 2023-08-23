from rest_framework import (
    viewsets,
    views,
    status,
    generics,
    mixins,
    authentication,
    permissions,
)
from .models import (
    User,
    UserExperience,
    UserEducation,
    UserCourse,
    UserSkill,
    UserLanguage,
    UserLink,
)
from .serializer import (
    UserSerializer,
    ProfileSerializer,
    UserExperienceSerializer,
    UserEducationSerializer,
    ContactSerializer,
    UserCourseSerializer,
    UserSkillSerializer,
    UserLanguageSerializer,
    UserLinkSerializer,
    UserAboutSerializer,
)
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.permissions import IsAuthenticated
from datetime import datetime


class SignupView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        password = request.data.get("password")
        confirm = request.data.get("confirm")

        if confirm != password:
            return Response({"invalid": "Passwords do not match"}, status=400)

        # hash that password
        hashed_password = make_password(password)
        request.data["password"] = hashed_password
        self.create(request, *args, **kwargs)
        return Response({"created": "Account created successfully"}, status=200)


class IndexView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer_class = UserSerializer(user, many=False)
        return Response(serializer_class.data)

    # def post(self, request, *args, **kwargs):
    #     username = kwargs.get('username')
    #     if username is not None:
    #         return self.retrieve(request, *args, **kwargs)


class ProfileSettingsView(
    generics.GenericAPIView,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(user, many=False)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        user = request.user
        instance = self.queryset.get(
            id=user.id
        )  # Get the user instance using the user's ID
        serializer = self.serializer_class(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        user = request.user
        instance = self.queryset.get(
            id=user.id
        )  # Get the user instance using the user's ID
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProfileImageUploadView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user  # Get the authenticated user
        profile_image = request.FILES.get("profile_image")
        # print(request.data["profile_image"])
        # print(profile_image)
        # print(user.profile_image)

        if request.data["profile_image"] == "default":
            user.profile_image.delete()
            user.profile_image = "defaults/default_profile_image.jpg"
            user.save()
            return Response(
                {"message": "Profile image updated"}, status=status.HTTP_200_OK
            )

        if profile_image:
            # Delete the existing profile image if it exists

            if user.profile_image != "defaults/default_profile_image.jpg":
                print(user.profile_image)
                user.profile_image.delete()

            user.profile_image = profile_image
            user.save()
            return Response(
                {"message": "Profile image updated"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST
            )


class BaseProfileUpdateView(generics.GenericAPIView, mixins.UpdateModelMixin):
    permission_classes = [IsAuthenticated]
    serializer_class = None  # Subclasses must set this

    def process_date(self, date_string):
        try:
            date_object = datetime.fromisoformat(date_string[:-1])
            return date_object.strftime("%Y-%m-%d")
        except ValueError:
            return None

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(user, many=False)
        print(serializer.data)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        user = request.user
        print(request.data)
        serializer = self.serializer_class(user, data=request.data)
        profile_image = request.data.get("profile_image")

        if profile_image == "/media/defaults/default_profile_image.jpg":
            print("default image")
            del request.data["profile_image"]

        if serializer.is_valid():
            # Check if profile_image is provided in the request
            if "profile_image" in request.FILES:
                serializer.validated_data["profile_image"] = request.FILES[
                    "profile_image"
                ]
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(BaseProfileUpdateView):
    serializer_class = ProfileSerializer
    queryset = User.objects.all()


class ProfileContactView(BaseProfileUpdateView):
    serializer_class = ContactSerializer
    queryset = User.objects.all()


class ProfileAboutView(BaseProfileUpdateView):
    serializer_class = UserAboutSerializer
    queryset = User.objects.all()


class BaseProfileView(
    generics.GenericAPIView,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    permission_classes = [IsAuthenticated]
    serializer_class = None

    def get_queryset(self):
        user = self.request.user
        pk = self.kwargs.get("pk")
        if pk is None:
            return self.queryset.filter(user=user)
        return self.queryset.filter(user=user, id=pk)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if request.data is None:
            serializer = self.serializer_class(data={})
        else:
            serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {
                    "created": f"{self.serializer_class.Meta.model.__name__} added successfully"
                },
                status=200,
            )
        return Response(serializer.errors, status=400)

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

    def delete(self, request, pk):
        try:
            instance = self.queryset.get(id=pk)
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


class ProfileEducationView(BaseProfileView):
    queryset = UserEducation.objects.all()
    serializer_class = UserEducationSerializer


class ProfileCourseView(BaseProfileView):
    queryset = UserCourse.objects.all()
    serializer_class = UserCourseSerializer


class ProfileExperienceView(BaseProfileView):
    queryset = UserExperience.objects.all()
    serializer_class = UserExperienceSerializer


class ProfileLanguageView(BaseProfileView):
    queryset = UserLanguage.objects.all()
    serializer_class = UserLanguageSerializer


class ProfileSkillView(BaseProfileView):
    queryset = UserSkill.objects.all()
    serializer_class = UserSkillSerializer


class ProfileLinkView(BaseProfileView):
    queryset = UserLink.objects.all()
    serializer_class = UserLinkSerializer
