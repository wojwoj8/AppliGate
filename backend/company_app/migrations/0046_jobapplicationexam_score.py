# Generated by Django 4.2.3 on 2023-12-12 17:15

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company_app', '0045_joboffer_exam_pass_percentage'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobapplicationexam',
            name='score',
            field=models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)]),
        ),
    ]