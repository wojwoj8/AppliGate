# Generated by Django 4.2.3 on 2023-08-09 15:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_app', '0005_user_image_link'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='image_link',
            field=models.CharField(blank=True, default=None, max_length=350, null=True),
        ),
    ]