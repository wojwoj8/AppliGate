from rest_framework import (
    viewsets,
    views,
    status,
    generics,
    mixins,
    authentication,
    permissions,
)
from .models import User, UserExperience, UserEducation
from .serializer import (
    UserSerializer,
    ProfileSerializer,
    UserExperienceSerializer,
    UserEducationSerializer,
    ContactSerializer,
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


class ProfileExperienceView(
    generics.GenericAPIView,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    permission_classes = [IsAuthenticated]
    queryset = UserExperience.objects.all()
    serializer_class = UserExperienceSerializer

    def get(self, request, *args, **kwargs):
        user = self.request.user
        print(args, kwargs)
        pk = kwargs.get("pk")
        if pk is None:
            queryset = UserExperience.objects.filter(user=user)
            serializer = self.serializer_class(queryset, many=True)
        else:
            queryset = UserExperience.objects.filter(user=user, id=pk)
            serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        user = request.user
        if request.data is None:
            serializer = self.serializer_class(data={})
        else:
            serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)

            return Response({"created": "Experience added successfully"}, status=200)
        return Response(serializer.errors, status=400)

    def put(self, request, *args, **kwargs):
        print(args, kwargs)
        user = request.user
        # print(request.data)
        item_id = request.data["id"]
        queryset = UserExperience.objects.get(user=user, id=item_id)

        serializer_class = UserExperienceSerializer(queryset, data=request.data)

        if serializer_class.is_valid():
            serializer_class.save()
            return Response(serializer_class.data)
        return Response(serializer_class.errors, status=400)

    def delete(self, request, pk):
        user = request.user
        try:
            experience = UserExperience.objects.get(user=user, id=pk)
            experience.delete()
            return Response({"deleted": "Experience deleted successfully"}, status=200)
        except UserExperience.DoesNotExist:
            return Response(
                {"error": "Experience not found"}, status=status.HTTP_404_NOT_FOUND
            )


class ProfileEducationView(
    generics.GenericAPIView,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    permission_classes = [IsAuthenticated]
    queryset = UserEducation.objects.all()
    serializer_class = UserEducationSerializer

    def get(self, request, *args, **kwargs):
        user = self.request.user
        print(args, kwargs)
        pk = kwargs.get("pk")
        if pk is None:
            queryset = UserEducation.objects.filter(user=user)
            serializer = self.serializer_class(queryset, many=True)
        else:
            queryset = UserEducation.objects.filter(user=user, id=pk)
            serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        user = request.user
        if request.data is None:
            serializer = self.serializer_class(data={})
        else:
            serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)

            return Response({"created": "Education added successfully"}, status=200)
        return Response(serializer.errors, status=400)

    def put(self, request, *args, **kwargs):
        print(args, kwargs)
        user = request.user
        # print(request.data)
        item_id = request.data["id"]
        queryset = UserEducation.objects.get(user=user, id=item_id)

        serializer_class = UserEducationSerializer(queryset, data=request.data)

        if serializer_class.is_valid():
            serializer_class.save()
            return Response(serializer_class.data)
        return Response(serializer_class.errors, status=400)

    def delete(self, request, pk):
        user = request.user
        try:
            experience = UserEducation.objects.get(user=user, id=pk)
            experience.delete()
            return Response({"deleted": "Education deleted successfully"}, status=200)
        except UserEducation.DoesNotExist:
            return Response(
                {"error": "Education not found"}, status=status.HTTP_404_NOT_FOUND
            )
