from django.contrib import admin
from .models import React, User
from django.contrib.auth.admin import UserAdmin

# Register your models here.
class ReactAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')

admin.site.register(React, ReactAdmin)
admin.site.register(User, UserAdmin)

