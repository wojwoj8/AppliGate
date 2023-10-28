from django.db import models
from user_app.models import User

# def profile_image_upload_path(instance, filename):
#     return f"user_profiles/profile_{instance.id}.{filename.split('.')[-1]}"

# Create your models here.
# For profile part
class CompanyProfileMain(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)


# For job offer part
class JobOffer(models.Model):
    # only company user can create joboffer
    company = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'company'})
    title = models.CharField(max_length=100)
    job_description = models.TextField()
    job_location = models.CharField(max_length=100)
    # Job Type: Full-time, Part-time, Contract, etc.
    job_type = models.CharField(max_length=100, blank=True)

    salary_min = models.DecimalField(max_digits=10, decimal_places=2)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2)
    salary_description = models.CharField(max_length=50, default='gross per month')
    salary_currency = models.CharField(max_length=10, default="PLN")

    job_responsibilities = models.TextField()
    job_requirements = models.TextField()
    job_published_at = models.DateTimeField(auto_now_add=True)
    job_application_deadline = models.DateTimeField()

    # Recruitment Type: Remote, In-company, On-site, etc.
    recruitment_type = models.CharField(max_length=100, blank=True)

    application_process = models.TextField() 
    job_benefits = models.TextField() 
    job_additional_information = models.TextField() 

    def __str__(self):
        return f"Company: {self.company} Position: {self.title} "


# Multiple
class JobOfferSkills(models.Model):
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE)
    skill = models.CharField(max_length=100, blank=False)
