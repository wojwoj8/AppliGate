# Generated by Django 4.2.3 on 2023-11-11 14:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company_app', '0020_joboffer_job_about'),
    ]

    operations = [
        migrations.AlterField(
            model_name='joboffer',
            name='job_about',
            field=models.TextField(blank=True),
        ),
    ]
