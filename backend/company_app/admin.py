from django.contrib import admin
from company_app.models import (
    JobOffer,
    JobOfferSkill,
    JobOfferResponsibility,
    JobOfferRequirement,
)

from django.contrib.auth.admin import UserAdmin


# Register your models here.



admin.site.register(JobOfferSkill)
admin.site.register(JobOffer)
admin.site.register(JobOfferResponsibility)
admin.site.register(JobOfferRequirement)
