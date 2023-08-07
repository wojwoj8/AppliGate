from rest_framework import (
    viewsets,
    views,
    status,
    generics,
    mixins,
    authentication,
    permissions,
)
from .models import User, UserExperience, UserEducation, UserCourse
from .serializer import (
    UserSerializer,
    ProfileSerializer,
    UserExperienceSerializer,
    UserEducationSerializer,
    ContactSerializer,
    UserCourseSerializer,
)
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password


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


class ProfileView(generics.GenericAPIView, mixins.UpdateModelMixin):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer_class = ProfileSerializer(user, many=False)
        return Response(serializer_class.data)

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer_class = ProfileSerializer(user, data=request.data)

        # Handle date format
        date = request.data["date_of_birth"]
        date_object = datetime.fromisoformat(date[:-1])  # Remove the "Z" at the end
        request.data["date_of_birth"] = date_object.strftime("%Y-%m-%d")
        print(request.data)
        if serializer_class.is_valid():
            serializer_class.save()
            return Response(serializer_class.data)
        return Response(serializer_class.errors, status=400)


class ProfileContactView(generics.GenericAPIView, mixins.UpdateModelMixin):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer_class = ContactSerializer(user, many=False)
        return Response(serializer_class.data)

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer_class = ContactSerializer(user, data=request.data)

        if serializer_class.is_valid():
            serializer_class.save()
            return Response(serializer_class.data)
        return Response(serializer_class.errors, status=400)


class BaseProfileView(
    generics.GenericAPIView,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    permission_classes = [IsAuthenticated]
    serializer_class = None  # Subclasses must set this

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
