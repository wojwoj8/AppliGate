# Generated by Django 4.2.3 on 2023-11-16 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company_app', '0029_rename_job_application_process_jobofferapplication_job_application_stage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='joboffer',
            name='job_additional_information',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='joboffer',
            name='job_benefits',
            field=models.TextField(blank=True),
        ),
    ]
