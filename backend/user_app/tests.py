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

    def test_successful_signup_company(self):
        data = {
            "username": "testuser2",
            "password": "testpassword2",
            "confirm": "testpassword2",
            "email": "testuser2@test.com",
            "user_type": "company"
        }
    
        response = self.client.post(reverse("register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['created'], "Account created successfully")
        # Verify that the user2 was created
        self.assertEqual(User.objects.count(), 2) #Counting setUp user
        user = User.objects.last()
        self.assertEqual(user.username, "testuser2")
        self.assertEqual(user.user_type, "company")

    def test_successful_signup_user(self):
        data = {
            "username": "testuser22",
            "password": "testpassword22",
            "confirm": "testpassword22",
            "email": "testuser2@test.com",
            "user_type": "user"
        }
    
        response = self.client.post(reverse("register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['created'], "Account created successfully")
        # Verify that the user2 was created
        self.assertEqual(User.objects.count(), 2) #Counting setUp user
        user = User.objects.last()
        self.assertEqual(user.username, "testuser22")
        self.assertEqual(user.user_type, "user")
        
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


    def test_user_type_invalid_signup(self):
        data = {
            "username": "testuser",
            "password": "testpassword",
            "confirm": "testpassword",
            "email": "testuser2@test.com",
            "user_type": "somethingwrong"
        }

        response = self.client.post(reverse("register"), data, format="json")
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['invalid'], 'Invalid user type')


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
        profile_settings_delete_account_url = reverse('settings')
        
        self.assertEqual(User.objects.count(), 2)
        headers = {"HTTP_AUTHORIZATION": f"Bearer {self.access_token}"}
        data = {
            "current_password": "testpassword",
        }
        wrong_data = {
            "current_password": "wrongpassword",
        }
        
        # Wrong password
        response = self.client.post(profile_settings_delete_account_url, wrong_data, format="json", **headers)
        error_message = response.data['current_password'][0]
        self.assertEqual(error_message, "Current password is incorrect.")
        self.assertEqual(User.objects.count(), 2)
        # Make the changes to the user
        response = self.client.post(profile_settings_delete_account_url, data, format="json", **headers)
        
        # self.assertEqual(response.data['message'], 'Password changed successfully')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 1)

class ProfileStatusTests(APITestCase):
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
        self.headers = {"HTTP_AUTHORIZATION": f"Bearer {self.access_token}"}

    def get_access_token(self):
        response = self.client.post(self.login_url, self.login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data["access"]
    
    def test_change_profile_status(self):
        profile_status_url = reverse('profile_status', args=[self.user.username])
        response = self.client.get(profile_status_url, format="json", **self.headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['public_profile'], False)

        data = {
            'public_profile': True
        }
        response = self.client.put(profile_status_url, data, format="json", **self.headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['public_profile'], True)
    
    def test_change_other_profile_status(self):
        profile_status_url = reverse('profile_status', args=[self.user2.username])
        data = {
            'public_profile': True
        }
        response = self.client.put(profile_status_url, data, format="json", **self.headers)
        error_message = response.data['detail']
        self.assertEqual(error_message, "You do not have permission to perform this action.")

class ProfileCvPersonalDataTests(APITestCase):
    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "password": "testpassword",
            "email": "testuser@test.com",
            "user_type": "user"
        }
        self.user_data2 = {
            "username": "testuser2",
            "password": "testpassword2",
            "email": "testuser2@test.com",
            "user_type": "user"
        }
        self.company_user_data3 = {
            "username": "company1",
            "password": "company1",
            "email": "company1@test.com",
            "user_type": "company"
        }
        self.user = User.objects.create_user(**self.user_data)
        self.user2 = User.objects.create_user(**self.user_data2)
        self.company_user = User.objects.create_user(**self.company_user_data3)
        
        self.login_data = {
            "username": self.user_data["username"],
            "password": self.user_data["password"],
        }
        self.login_url = reverse("token_obtain_pair")
        self.access_token = self.get_access_token()
        self.headers = {"HTTP_AUTHORIZATION": f"Bearer {self.access_token}"}

    def get_access_token(self, login_data=None):
        if login_data is None:
            login_data = self.login_data
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data["access"]
    
    def test_user_personal(self):
        profile_personal_url = reverse('personal', args=[self.user.username])
        response = self.client.get(profile_personal_url, format="json", **self.headers)
        # no data
        self.assertEqual(response.data, {'current_position': None, 'first_name': '', 'last_name': '', 
                                         'date_of_birth': None, 'country': None, 'city': None, 'profile_image': '/media/defaults/default_profile_image.jpg'})
        
        data = {'current_position': None, 
                'first_name': 'Wojciech', 
                'last_name': 'Żubrowski', 
                }
        
        response = self.client.put(profile_personal_url, data, format="json", **self.headers)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(profile_personal_url, format="json", **self.headers)
        self.assertEqual(response.data['first_name'], "Wojciech")

    def test_other_user_personal(self):

        data = {'current_position': None, 
                'first_name': 'Wojciech', 
                'last_name': 'Żubrowski', 
                'date_of_birth': None, 
                'country': None, 
                'city': None, 
                'profile_image': '/media/defaults/default_profile_image.jpg'
                }
        
        profile_personal_url = reverse('personal', args=[self.user2.username])
        response = self.client.get(profile_personal_url, format="json", **self.headers)
        error_message = str(response.data['detail'])
        self.assertEqual(error_message, "Profile is private")

        #set to public
        self.user2.public_profile = True
        self.user2.save()
        response = self.client.get(profile_personal_url, format="json", **self.headers)
        self.assertEqual(response.data['first_name'], "")

        #try use put on other account
        
        response = self.client.put(profile_personal_url, data, format="json", **self.headers)
        # print(self.headers)
        # print(response.data)
        error_message = response.data['detail']
        
        self.assertEqual(error_message, "You do not have permission to perform this action.")



    def test_user_personal_error_fields(self):
        profile_personal_url= reverse('personal', args=[self.user.username])
        data = {'current_position': None, 
                'first_name': 'Wojciech', 
                'last_name': 'Żubrowski', 
                'date_of_birth': 23-34-54, 
                'country': None, 
                'city': None, 
                'profile_image': '/medi'
                }
        
        response = self.client.put(profile_personal_url, data, format="json", **self.headers)
        error_message = str(response.data['date_of_birth'][0])
        self.assertEqual(error_message, "Invalid date format. Use 'YYYY-MM-DD'.")

        data2 = {'current_position': None, 
                'first_name': 'Wojciech', 
                'last_name': 'Żubrowski', 
                'date_of_birth': "2023-10-10", 
                'country': None, 
                'city': None, 
                'profile_image': '/medi'
                }
        response = self.client.put(profile_personal_url, data2, format="json", **self.headers)
        
        # Set profile_image to default
        self.assertEqual(response.data["profile_image"], '/media/defaults/default_profile_image.jpg')
        self.assertEqual(response.data["date_of_birth"], '2023-10-10')

    
    def test_user_personal_edit_as_company(self):
        # Authenticate as the company user
        company_user_login_data = {
            "username": self.company_user_data3["username"],
            "password": self.company_user_data3["password"],
        }
        company_user_access_token = self.get_access_token(company_user_login_data)
        company_user_headers = {"HTTP_AUTHORIZATION": f"Bearer {company_user_access_token}"}

        self.user.first_name = 'Wojciech'
        self.user.public_profile = True
        self.user.save()

        # Attempt to post data to user1's personal profile
        user1_personal_url = reverse('personal', args=[self.user.username])  # Changed to target "user" instead of "company_user"
        data_to_post = {
            'first_name': 'John',
            'last_name': 'Doe',
        }
        
        response = self.client.put(user1_personal_url, data_to_post, format="json", **company_user_headers)  # Use company_user_headers
        error_message = response.data['detail']
        
        # Ensure the response indicates permission denied (HTTP 403 Forbidden)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Verify that the personal data for user1 remains unchanged
        response = self.client.get(user1_personal_url, format="json", **company_user_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], "Wojciech")  # Ensure the data is still Wojciech


class ProfileImageTests(APITestCase):
    def setUp(self):
        #special id because that work in media user images
        self.user_data = {
            "id": 1337,
            "username": "testuser",
            "password": "testpassword",
            "email": "testuser@test.com"
        }
        self.user_data2 = {
            "id": 1338,
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
        self.headers = {"HTTP_AUTHORIZATION": f"Bearer {self.access_token}"}

    def get_access_token(self):
        response = self.client.post(self.login_url, self.login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data["access"]
    
    def test_user_image_post(self):
        image_path = './media/defaults/test_image.jpg'

        put_image_url = reverse('upload_image', args=[self.user.username])
        profile_personal_url= reverse('personal', args=[self.user.username])
        with open(image_path, 'rb') as image_file:
            response = self.client.put(put_image_url, {'profile_image': image_file}, format='multipart', **self.headers)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Profile image updated')
        response = self.client.get(profile_personal_url, format="json", **self.headers)
        self.assertEqual(response.data['profile_image'], '/media/user_profiles/profile_1337.jpg')
    
        #test_delete_image
        response = self.client.put(put_image_url, {'profile_image': 'default'}, format='multipart', **self.headers)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Profile image updated')
        response = self.client.get(profile_personal_url, format="json", **self.headers)
        self.assertEqual(response.data['profile_image'], '/media/defaults/default_profile_image.jpg')

        profile_personal_url = reverse('personalCompany', args=[self.user.username])
        response = self.client.get(profile_personal_url, format="json", **self.headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.put(profile_personal_url, {'first_name': "shouldNotWork"}, format="json", **self.headers)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        error_message = response.data['detail']
        
        self.assertEqual(error_message, "You do not have permission to perform this action.")


    
    def test_user_wrong_image_post(self):
        image_path = './media/defaults/test_image.webp'

        put_image_url = reverse('upload_image', args=[self.user.username])
        profile_personal_url= reverse('personal', args=[self.user.username])
        with open(image_path, 'rb') as image_file:
            response = self.client.put(put_image_url, {'profile_image': image_file}, format='multipart', **self.headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid image file format')
        response = self.client.get(profile_personal_url, format="json", **self.headers)
        self.assertEqual(response.data['profile_image'], '/media/defaults/default_profile_image.jpg')
        
class WrongProfileTypeView(APITestCase):
    def setUp(self):
        self.user_data3 = {
            "username": "testuser",
            "password": "testpassword",
            "email": "testuser@test.com",
            "user_type": "user"
        }
        self.user_data2 = {
            "username": "testuser2",
            "password": "testpassword2",
            "email": "testuser2@test.com",
            "user_type": "user"
        }
        self.user_data = {
            "username": "company1",
            "password": "company1",
            "email": "company1@test.com",
            "user_type": "company"
        }
        self.user = User.objects.create_user(**self.user_data)
        self.user2 = User.objects.create_user(**self.user_data2)
        self.company_user = User.objects.create_user(**self.user_data3)
        
        self.login_data = {
            "username": self.user_data["username"],
            "password": self.user_data["password"],
        }
        self.login_url = reverse("token_obtain_pair")
        self.access_token = self.get_access_token()
        self.headers = {"HTTP_AUTHORIZATION": f"Bearer {self.access_token}"}

    def get_access_token(self, login_data=None):
        if login_data is None:
            login_data = self.login_data
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data["access"]

    def test_company_personal(self):
        profile_personal_url = reverse('personalCompany', args=[self.user.username])
        response = self.client.get(profile_personal_url, format="json", **self.headers)
        
        # no data
        self.assertEqual(response.data, 
                         {'current_position': None, 
                          'first_name': '', 
                          'country': None, 
                          'city': None, 
                          'profile_image': '/media/defaults/default_profile_image.jpg', 
                          'background_image': '/media/defaults/default_background.png'}
        )
        data = {
                'first_name': 'Wojciech', 
                 
                }
        
        response = self.client.put(profile_personal_url, data, format="json", **self.headers)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(profile_personal_url, format="json", **self.headers)
        self.assertEqual(response.data['first_name'], "Wojciech")

        profile_personal_url = reverse('personal', args=[self.user.username])
        response = self.client.get(profile_personal_url, format="json", **self.headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


        
