# Generated by Django 4.2.3 on 2023-11-14 16:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('company_app', '0025_alter_jobofferrequirement_requirement_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='jobofferrequirement',
            name='requirement_type',
        ),
    ]
