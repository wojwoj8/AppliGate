from django.contrib import admin
from .models import User, UserExpirience
from django.contrib.auth.admin import UserAdmin

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'password', 'email')

admin.site.register(User, UserAdmin)
admin.site.register(UserExpirience)

