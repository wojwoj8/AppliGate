from django.contrib import admin
from company_app.models import (
    JobOffer,
    JobOfferSkill,
    JobOfferResponsibility,
    JobOfferRequirement,
    JobOfferWhatWeOffer,
    JobApplication,
    Question, 
    JobOfferExam, 
    JobApplicationExam
)

from django.contrib.auth.admin import UserAdmin


# Register your models here.

class QuestionAdmin(admin.ModelAdmin):
    list_display = ['question', 'choice_a', 'choice_b', 'choice_c', 'choice_d', 'correct_choice']

admin.site.register(Question, QuestionAdmin)
admin.site.register(JobOfferExam)
admin.site.register(JobApplicationExam)


admin.site.register(JobOfferSkill)
admin.site.register(JobOffer)
admin.site.register(JobOfferResponsibility)
admin.site.register(JobOfferRequirement)
admin.site.register(JobOfferWhatWeOffer)
admin.site.register(JobApplication)
