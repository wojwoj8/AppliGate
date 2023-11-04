from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField


# Create your models here.


def profile_image_upload_path(instance, filename):
    return f"user_profiles/profile_{instance.id}.{filename.split('.')[-1]}"

def profile_background_image_upload_path(instance, filename):
    return f"user_profiles/backgrounds/profile_{instance.id}.{filename.split('.')[-1]}"


# Only one
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
    about_me = models.CharField(max_length=500, null=True, blank=True)
    profile_image = models.ImageField(
        upload_to=profile_image_upload_path,
        blank=False,
        null=True,
        default="defaults/default_profile_image.jpg",
    )
    background_image = models.ImageField(
        upload_to=profile_background_image_upload_path,
        blank=False,
        null=True,
        default="defaults/default_background.png",
    )
    professional_summary = models.CharField(max_length=500, null=True, blank=True)
    public_profile = models.BooleanField(default=False)
    # For user type
    USER_TYPE_CHOICES = [
        ('user', 'User'),
        ('company', 'Company'),
    ]
    
    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES,
        default='user',
    )

    def __str__(self):
        return f"{self.username}"

# Multiple
class UserExperience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    position = models.CharField(max_length=100, blank=False)
    localization = models.CharField(max_length=100, null=True, blank=True)
    company = models.CharField(max_length=100, null=True, blank=True)
    from_date = models.DateField(null=False, blank=False, default=None)
    to_date = models.DateField(null=True, blank=True)
    responsibilities = models.CharField(max_length=1500, null=True, blank=True)


# Multiple
class UserEducation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    school = models.CharField(max_length=100, blank=False)
    educational_level = models.CharField(max_length=100, blank=False)
    major = models.CharField(max_length=100, null=True, blank=True)
    specialization = models.CharField(max_length=100, null=True, blank=True)
    from_date = models.DateField(null=False, blank=False, default=None)
    to_date = models.DateField(null=True, blank=True)


# Multiple
class UserCourse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course_name = models.CharField(max_length=100, blank=False)
    organizer = models.CharField(max_length=100, blank=False)
    certificate_link = models.CharField(max_length=250, null=True, blank=True)
    finish_date = models.DateField(null=True, blank=True)


# Multiple
class UserSkill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill = models.CharField(max_length=100, blank=False)


# Multiple
class UserLanguage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    language = models.CharField(max_length=50, blank=False)
    language_level = models.CharField(max_length=30, blank=False)


# Multiple
class UserLink(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    link_name = models.CharField(max_length=50, blank=False)
    link = models.CharField(max_length=250, blank=False)
