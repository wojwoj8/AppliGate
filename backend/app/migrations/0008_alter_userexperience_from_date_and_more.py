# Generated by Django 4.2.3 on 2023-08-01 09:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_alter_userexperience_from_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userexperience',
            name='from_date',
            field=models.DateField(default=None),
        ),
        migrations.AlterField(
            model_name='userexperience',
            name='position',
            field=models.CharField(default=None, max_length=100),
        ),
    ]
