from django.contrib import admin
from .models import React

# Register your models here.
class ReactAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')

admin.site.register(React, ReactAdmin)