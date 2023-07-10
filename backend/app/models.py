from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class React(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title
    
class User(AbstractUser):
    nickname = models.CharField(max_length=100, null=True, blank=True, unique=True)