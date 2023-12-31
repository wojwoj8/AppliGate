# Generated by Django 4.2.3 on 2023-10-21 14:21

from django.db import migrations, models
import user_app.models


class Migration(migrations.Migration):

    dependencies = [
        ('user_app', '0021_user_user_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='profile_background',
            field=models.ImageField(default='defaults/default_profile_image.jpg', null=True, upload_to=user_app.models.profile_image_upload_path),
        ),
    ]
