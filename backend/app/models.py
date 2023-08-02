from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.


class User(AbstractUser):
    email = models.EmailField(unique=True)
    contact_email = models.EmailField(null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    phone_number = PhoneNumberField(default=None, null=True, blank=True)
    current_position = models.CharField(
        max_length=100, default=None, null=True, blank=True
    )


class UserExperience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    position = models.CharField(max_length=100, blank=False)
    localization = models.CharField(max_length=100, null=True, blank=True)
    company = models.CharField(max_length=100, null=True, blank=True)
    from_date = models.DateField(null=False, blank=False, default=None)
    to_date = models.DateField(null=True, blank=True)
    responsibilities = models.CharField(max_length=1500, null=True, blank=True)
