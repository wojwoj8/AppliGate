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
    ChangePasswordSerializer,
    ChangeUserDataSerializer,
    DeleteUserDataSerializer,
    UserSummarySerializer,
    UserProfileStatus,
)
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from rest_framework.generics import get_object_or_404
import os


class SignupView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        user_types = [
        ('user', 'User'),
        ('company', 'Company'),
    ]
        password = request.data.get("password")
        confirm = request.data.get("confirm")

        if confirm != password:
            return Response({"invalid": "Passwords do not match"}, status=400)

        # hash that password
        hashed_password = make_password(password)
        request.data["password"] = hashed_password

        if request.data["user_type"] ==  None:
            request.data["user_type"] = 'user'
        
        if not request.data["user_type"] or request.data["user_type"] not in dict(user_types):
            print(request.data["user_type"])
            print('not in types')
            return Response({"invalid": "Invalid user type"}, status=400)

        
        self.create(request, *args, **kwargs)
        return Response({"created": "Account created successfully"}, status=201)



class IndexView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer_class = UserSerializer(user, many=False)
        #print(serializer_class.data)
        return Response(serializer_class.data)


class ProfileChangeDataView(
    generics.GenericAPIView,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = ChangeUserDataSerializer

    def get(self, request, *args, **kwargs):
        user = request.user

        serializer = self.serializer_class(user, many=False)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        user = request.user
        instance = self.queryset.get(id=user.id)
        serializer = self.serializer_class(
            instance, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        user = request.user
        instance = self.queryset.get(id=user.id)
        delete_serializer = DeleteUserDataSerializer(
            instance, data=request.data, context={"request": request}
        )

        # Check if the delete_serializer is valid (if you have any fields)
        if delete_serializer.is_valid():
            # delete user image from media
            if user.profile_image != "defaults/default_profile_image.jpg":
                user.profile_image.delete()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(delete_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileChangePasswordView(generics.GenericAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        # print(request.data)
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            user = request.user
            new_password = serializer.validated_data["new_password"]

            user.set_password(new_password)
            user.save()
            return Response(
                {"message": "Password changed successfully"}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileStatusView(generics.GenericAPIView):
    def check_username_permission(self):
        username = self.kwargs.get("username")
        if self.request.user.username != username:
            raise PermissionDenied("You do not have permission to perform this action.")

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserProfileStatus(user)  # Pass the user instance to the serializer
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        self.check_username_permission()
        user = request.user
        serializer = UserProfileStatus(
            user, data=request.data
        )  # Pass the user instance and request data to the serializer

        if serializer.is_valid():
            serializer.save()
            #print(serializer.data)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileImageUploadView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def check_username_permission(self):
        username = self.kwargs.get("username")
        if self.request.user.username != username:
            raise PermissionDenied("You do not have permission to perform this action.")

    def is_valid_image_extension(self, file_name):
        valid_extensions = ['.jpg', '.jpeg', '.png', '.jfif', '.gif', '.bmp']
        file_extension = os.path.splitext(file_name)[1].lower()
        return file_extension in valid_extensions
    
    def update(self, request, *args, **kwargs):
        self.check_username_permission()
        user = request.user  # Get the authenticated user
        profile_image = request.FILES.get("profile_image")

        if request.data["profile_image"] == "default":
            user.profile_image.delete()
            user.profile_image = "defaults/default_profile_image.jpg"
            user.save()
            return Response(
                {"message": "Profile image updated"}, status=status.HTTP_200_OK
            )

        if profile_image:
            # extension check
            if not self.is_valid_image_extension(profile_image.name):
                return Response(
                    {"error": "Invalid image file format"}, status=status.HTTP_400_BAD_REQUEST
                )
            # Delete the existing profile image if it exists

            if user.profile_image != "defaults/default_profile_image.jpg":
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

    def check_username_profile(self):
        # checked username
        username = self.kwargs.get("username")
        checked_user = get_object_or_404(User, username=username)
        if self.request.user != checked_user and not checked_user.public_profile:
            raise PermissionDenied("Profile is private")

    def check_username_permission(self):
        username = self.kwargs.get("username")
        if self.request.user.username != username:
            raise PermissionDenied("You do not have permission to perform this action.")

    def get(self, request, *args, **kwargs):
        self.check_username_profile()
        username = self.kwargs.get("username")  # Get the username from URL

        if username:
            user = get_object_or_404(User, username=username)

            serializer = self.serializer_class(user, many=False)
            return Response(serializer.data)
        else:
            user = request.user
            serializer = self.serializer_class(user, many=False)
            # print(serializer.data)
            return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        self.check_username_permission()
        user = request.user
        serializer = self.serializer_class(user, data=request.data)
        profile_image = request.data.get("profile_image")

        if profile_image == "defaults/default_profile_image.jpg":
            # If the profile_image is the default one, remove it from request data
            del request.data["profile_image"]

        # Remove the 'profile_image' key from the request data entirely
        request.data.pop("profile_image", None)

        serializer = self.serializer_class(user, data=request.data, partial=True)

        if serializer.is_valid():
            # Check if profile_image is provided in the request
            if "profile_image" in request.FILES:
                serializer.validated_data["profile_image"] = request.data[
                    "profile_image"
                ]
                print(serializer.data)
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


class ProfileSummaryView(BaseProfileUpdateView):
    serializer_class = UserSummarySerializer
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

        username = self.kwargs.get("username")
        pk = self.kwargs.get("pk")

        if username:
            return self.queryset.filter(user__username=username)

        if pk is None:
            return self.queryset.filter(user=user)
        return self.queryset.filter(user=user, id=pk)

    # for letting only for get method looking at other CV's
    def check_username_permission(self):
        # checked username
        username = self.kwargs.get("username")

        if self.request.user.username != username:
            raise PermissionDenied("You do not have permission to perform this action.")

    # for letting to see others profile only if profile is public
    def check_username_profile(self):
        # checked username
        username = self.kwargs.get("username")
        checked_user = get_object_or_404(User, username=username)
        if self.request.user != checked_user and not checked_user.public_profile:
            raise PermissionDenied("Profile is private")

    def get(self, request, *args, **kwargs):
        # print(request.user)
        self.check_username_profile()
        queryset = self.get_queryset()

        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        self.check_username_permission()
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
        self.check_username_permission()
        item_id = request.data.get("id")
        # print(item_id)
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
        self.check_username_permission()
        pk = kwargs.get("pk")

        try:
            instance = self.queryset.get(id=pk)
            # print(instance)
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

    def get_queryset(self):
        username = self.kwargs.get("username")
        return self.queryset.filter(user__username=username)


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
