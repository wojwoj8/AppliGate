# Generated by Django 4.2.3 on 2023-11-12 18:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company_app', '0024_remove_joboffer_job_requirements_jobofferrequirement'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobofferrequirement',
            name='requirement_type',
            field=models.CharField(choices=[('required', 'Required'), ('optional', 'Optional')], default='required', max_length=40),
        ),
    ]
