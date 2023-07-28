from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

    
class User(AbstractUser):
    email=models.EmailField(unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    