from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from user_app.models import User
from user_app.serializer import UserSerializer

class AuthenticationTests(APITestCase):
    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "password": "testpassword",
            "email": "testuser@test.com"
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_successful_signup(self):
        data = {
            "username": "testuser2",
            "password": "testpassword2",
            "confirm": "testpassword2",
            "email": "testuser2@test.com"
        }

        response = self.client.post(reverse("register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify that the user2 was created
        self.assertEqual(User.objects.count(), 2) #Counting setUp user
        user = User.objects.last()
        self.assertEqual(user.username, "testuser2")

    def test_password_mismatch_signup(self):
        data = {
            "username": "testuser",
            "password": "testpassword",
            "confirm": "mismatchedpassword",
            "email": "testuser@test.com"
        }

        response = self.client.post(reverse("register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)  # Ensure user is not created

    def test_successful_login(self):
        data = {
            "username": self.user_data["username"],
            "password": self.user_data["password"],
        }

        response = self.client.post(reverse("token_obtain_pair"), data, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_failed_login(self):
        data = {
            "username": "testuser",
            "password": "wrongpassword",
        }

        response = self.client.post(reverse("token_obtain_pair"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
