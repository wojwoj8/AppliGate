from django.db import models
from user_app.models import User
from django.core.validators import RegexValidator
# def profile_image_upload_path(instance, filename):
#     return f"user_profiles/profile_{instance.id}.{filename.split('.')[-1]}"


# regular expression pattern to validate a hexadecimal color code
hex_color_validator = RegexValidator(
    regex=r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
    message='Enter a valid hexadecimal color code. (e.g. #RRGGBB or #RGB)',
)

# Create your models here.
# For profile part
class CompanyProfileMain(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)


# For job offer part
class JobOffer(models.Model):
    # only company user can create joboffer
    company = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'company'})
    title = models.CharField(max_length=40, blank=False)
    job_description = models.TextField()
    job_location = models.CharField(max_length=100, blank=False)
    # work_schedule: Full-time, Part-time, etc.
    work_schedule = models.CharField(max_length=100, blank=False)
    #position_level: specialist (mid / regular), junior specialist (junior), etc.
    position_level = models.CharField(max_length=100, blank=False)
    # contract_type: contract of employment, b2b etc.
    contract_type = models.CharField(max_length=100, blank=False)
    # wakat
    vacancy = models.CharField(max_length=50, blank=True)
    # remote, stationary etc
    work_mode = models.CharField(max_length=100, blank=True)

    svg_color = models.CharField(max_length=7, blank=True, validators=[hex_color_validator], default='#ffffff')
    background_color = models.CharField(max_length=7, blank=True, validators=[hex_color_validator], default='#ff0000')

    specialization = models.CharField(max_length=100, blank=False)



    #salary part
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, blank=False)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, blank=False)
    salary_type = models.CharField(max_length=20, default='per hour', blank=False)
    salary_currency = models.CharField(max_length=5, default="PLN", blank=False)

    job_responsibilities = models.TextField()
    job_requirements = models.TextField()
    job_published_at = models.DateTimeField(auto_now_add=True, blank=False)
    job_application_deadline = models.DateField(blank=False)

    # Recruitment Type: Remote, In-company, On-site, etc.
    recruitment_type = models.CharField(max_length=100, blank=True)

    application_process = models.TextField() 
    job_benefits = models.TextField() 
    job_additional_information = models.TextField() 

    job_offer_status = models.BooleanField(default=False)

    def __str__(self):
        return f"Company: {self.company} Position: {self.title}"


# Multiple
class JobOfferSkill(models.Model):
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE)
    skill = models.CharField(max_length=100, blank=False)
    SKILL_TYPE_CHOICES = [
        ("required", "Required"),
        ("optional", "Optional"),
    ]
    skill_type = models.CharField(max_length=40, choices=SKILL_TYPE_CHOICES)
