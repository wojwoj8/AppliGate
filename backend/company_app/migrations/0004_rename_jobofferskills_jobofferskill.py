# Generated by Django 4.2.3 on 2023-11-02 17:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('company_app', '0003_remove_joboffer_salary_description_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='JobOfferSkills',
            new_name='JobOfferSkill',
        ),
    ]