from django.db import models
from user_app.models import User

from django.core.validators import (
    RegexValidator,
    MinValueValidator, 
    MaxValueValidator,

    )

# def profile_image_upload_path(instance, filename):
#     return f"user_profiles/profile_{instance.id}.{filename.split('.')[-1]}"


# regular expression pattern to validate a hexadecimal color code
hex_color_validator = RegexValidator(
    regex=r"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
    message="Enter a valid hexadecimal color code. (e.g. #RRGGBB or #RGB)",
)


# Create your models here.
# For profile part
class CompanyProfileMain(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)


# For job offer part
class JobOffer(models.Model):
    # can get other models data as foreign key
    def get_skills(self):
        return self.jobofferskill_set.all()

    def get_responsibilities(self):
        return self.jobofferresponsibility_set.all()

    def get_requirements(self):
        return self.jobofferrequirement_set.all()

    def get_what_we_offer(self):
        return self.jobofferwhatweoffer_set.all()

    def get_applications(self):
        return self.jobofferapplication_set.all()

    # only company user can create joboffer
    company = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={"user_type": "company"}
    )
    title = models.CharField(max_length=40, blank=False)
    job_location = models.CharField(max_length=100, blank=False)
    # work_schedule: Full-time, Part-time, etc.
    work_schedule = models.CharField(max_length=100, blank=False)
    # position_level: specialist (mid / regular), junior specialist (junior), etc.
    position_level = models.CharField(max_length=100, blank=False)
    # contract_type: contract of employment, b2b etc.
    contract_type = models.CharField(max_length=100, blank=False)
    # wakat
    vacancy = models.CharField(max_length=50, blank=False)
    # remote, stationary etc
    work_mode = models.CharField(max_length=100, blank=False)

    svg_color = models.CharField(
        max_length=7, blank=True, validators=[hex_color_validator], default="#2c2cdb"
    )
    background_color = models.CharField(
        max_length=7, blank=True, validators=[hex_color_validator], default="#f7f2f2"
    )

    specialization = models.CharField(max_length=100, blank=False)

    # salary part
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, blank=False,
                                     validators=[MinValueValidator(0)])
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, blank=False,
                                     validators=[MinValueValidator(0)])
    salary_type = models.CharField(max_length=20, default="per hour", blank=False)
    salary_currency = models.CharField(max_length=5, default="PLN", blank=False)

    job_about = models.TextField(blank=True)
    job_published_at = models.DateTimeField(auto_now_add=True, blank=False)
    job_application_deadline = models.DateField(blank=False)

    # Recruitment Type: Remote, In-company, On-site, etc.
    recruitment_type = models.CharField(max_length=100, blank=True)

    job_benefits = models.TextField(blank=True)
    job_additional_information = models.TextField(blank=True)

    job_offer_status = models.BooleanField(default=False)

    has_exam = models.BooleanField(default=False)
    exam_pass_percentage = models.PositiveIntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Pass percentage required for the exam"
    )


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


# Multiple
class JobOfferResponsibility(models.Model):
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE)
    job_responsibility = models.CharField(max_length=300, blank=False)


# Multiple
class JobOfferRequirement(models.Model):
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE)
    job_requirement = models.CharField(max_length=300, blank=False)


class JobOfferWhatWeOffer(models.Model):
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE)
    job_whatweoffer = models.CharField(max_length=150, blank=False)


# recrutation process
class JobOfferApplication(models.Model):
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE)
    job_application_stage = models.CharField(max_length=100, blank=False)


class Question(models.Model):
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE)
    question = models.CharField(max_length=300, blank=False)
    choice_a = models.CharField(max_length=200, blank=False)
    choice_b = models.CharField(max_length=200, blank=False)
    choice_c = models.CharField(max_length=200, blank=False)
    choice_d = models.CharField(max_length=200, blank=False)
    correct_choice = models.CharField(max_length=1, blank=False, choices=[('a', 'A'), ('b', 'B'), ('c', 'C'), ('d', 'D')])


#user applications
class JobApplication(models.Model):
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name="applications")
    applicant = models.ForeignKey(User, on_delete=models.CASCADE)
    application_date = models.DateTimeField(auto_now_add=True)
    APPLICATION_STATUS = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]
    status = models.CharField(max_length=15, choices=APPLICATION_STATUS, default="pending")

    # New field to link to the exam
    exam_answers = models.OneToOneField('JobApplicationExam', on_delete=models.SET_NULL, null=True, blank=True, related_name='application_answers')


    def __str__(self):
        return f"Applicant: {self.applicant} for Job: {self.job_offer.title}"

    # user answers for the exam
class JobApplicationExam(models.Model):
    
    application = models.OneToOneField(JobApplication, on_delete=models.CASCADE, related_name='user_exam_answers')
    answers = models.JSONField(blank=True)  # Store user answers as a JSON array
    score = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        blank = True,
        null= True
    )

