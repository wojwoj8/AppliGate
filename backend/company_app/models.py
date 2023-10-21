from django.db import models
from user_app.models import User

# def profile_image_upload_path(instance, filename):
#     return f"user_profiles/profile_{instance.id}.{filename.split('.')[-1]}"

# Create your models here.
class CompanyProfileMain(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

