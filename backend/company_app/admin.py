from django.contrib import admin
from company_app.models import (
    JobOffer,
    CompanyProfileMain,
)

from django.contrib.auth.admin import UserAdmin


# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "password", "email")



admin.site.register(JobOffer)
