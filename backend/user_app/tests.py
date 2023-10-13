from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from user_app.models import User
from user_app.serializer import UserSerializer
from django.contrib.auth import get_user_model

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
        self.assertEqual(response.data['created'], "Account created successfully")
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
        self.assertEqual(response.data['invalid'], 'Passwords do not match')
        self.assertEqual(User.objects.count(), 1)  # Ensure user is not created

    def test_successful_login(self):
        data = {
            "username": self.user_data["username"],
            "password": self.user_data["password"],
        }

        response = self.client.post(reverse("token_obtain_pair"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        access_token = response.data["access"]

        # Use the access token to access the IndexView
        index_url = reverse("index") 
        headers = {"HTTP_AUTHORIZATION": f"Bearer {access_token}"}
        response = self.client.get(index_url, format="json", **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_failed_login(self):
        data = {
            "username": "testuser",
            "password": "wrongpassword",
        }

        response = self.client.post(reverse("token_obtain_pair"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class ProfileSettingsTests(APITestCase):
    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "password": "testpassword",
            "email": "testuser@test.com"
        }
        self.user_data2 = {
            "username": "testuser2",
            "password": "testpassword2",
            "email": "testuser2@test.com"
        }
        self.user = User.objects.create_user(**self.user_data)
        self.user2 = User.objects.create_user(**self.user_data2)
        self.login_data = {
            "username": self.user_data["username"],
            "password": self.user_data["password"],
        }
        self.login_url = reverse("token_obtain_pair")
        self.access_token = self.get_access_token()

    def get_access_token(self):
        response = self.client.post(self.login_url, self.login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data["access"]

    def test_profile_settings_change_username_email(self):
        profile_settings_url = reverse("settings")
        headers = {"HTTP_AUTHORIZATION": f"Bearer {self.access_token}"}
        data = {
            "username": "newtestuser",
            "email": "newtestuser@test.com",
            "current_password": "testpassword",
        }
        wrong_password = {
            "username": "newtestuser",
            "email": "newtestuser@test.com",
            "current_password": "wrongpassword",
        }
        existing_username = {
            "username": "testuser2",
            "email": "newtestuser@test.com",
            "current_password": "wrongpassword",
        }

        #wrong data test
        response = self.client.put(profile_settings_url, wrong_password, format="json", **headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        error_message = response.data['current_password'][0]
        self.assertEqual(error_message, 'Current password is incorrect.')

        # username change to existing user
        response = self.client.put(profile_settings_url, existing_username, format="json", **headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        error_message = response.data['username'][0]
        self.assertEqual(error_message, 'A user with that username already exists.')
        
        # Make the changes to the user
        response = self.client.put(profile_settings_url, data, format="json", **headers)
        

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh the user from the database
        updated_user = get_user_model().objects.get(pk=self.user.pk)

        self.assertEqual(updated_user.username, "newtestuser")
        
        self.assertEqual(updated_user.email, "newtestuser@test.com")

    def test_profile_settings_change_password(self):
        profile_settings_password_url = reverse('settings_password', args=[self.user.pk])
        password = self.user.password
        
        headers = {"HTTP_AUTHORIZATION": f"Bearer {self.access_token}"}
        data = {
            "current_password": "testpassword",
            "new_password": "newtestpassword",
            "confirm_password": "newtestpassword"
        }
        wrong_data ={
            "current_password": "wrongpassword",
            "new_password": "testpassword2",
            "confirm_password": "testpassword2"
        }
        wrong_passwords ={
            "current_password": "testpassword",
            "new_password": "testpassword2",
            "confirm_password": "wrongpassword"
        }
        
        # Wrong password
        response = self.client.put(profile_settings_password_url, wrong_data, format="json", **headers)
        error_message = response.data['current_password'][0]
        self.assertEqual(error_message, "Current password is incorrect.")

        # Missmatching passwords

        response = self.client.put(profile_settings_password_url, wrong_passwords, format="json", **headers)
        
        error_message = response.data['confirm_password'][0]
        self.assertEqual(error_message, "New passwords do not match.")

        # Make the changes to the user
        response = self.client.put(profile_settings_password_url, data, format="json", **headers)
        
        self.assertEqual(response.data['message'], 'Password changed successfully')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh the user from the database
        updated_user = get_user_model().objects.get(pk=self.user.pk)

        self.assertTrue(updated_user.check_password("newtestpassword"))
        
        
    def test_profile_settings_delete_account(self):
        profile_settings_password_url = reverse('settings')
        
        self.assertEqual(User.objects.count(), 2)
        headers = {"HTTP_AUTHORIZATION": f"Bearer {self.access_token}"}
        data = {
            "current_password": "testpassword",
        }
        wrong_data = {
            "current_password": "wrongpassword",
        }
        
        # Wrong password
        response = self.client.post(profile_settings_password_url, wrong_data, format="json", **headers)
        error_message = response.data['current_password'][0]
        self.assertEqual(error_message, "Current password is incorrect.")
        self.assertEqual(User.objects.count(), 2)
        # Make the changes to the user
        response = self.client.post(profile_settings_password_url, data, format="json", **headers)
        
        # self.assertEqual(response.data['message'], 'Password changed successfully')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 1)