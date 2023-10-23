# Generated by Django 4.2.3 on 2023-10-21 14:37

from django.db import migrations, models
import user_app.models


class Migration(migrations.Migration):

    dependencies = [
        ('user_app', '0023_rename_profile_background_user_background_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='background_image',
            field=models.ImageField(default='defaults/default_profile_image.jpg', null=True, upload_to=user_app.models.profile_background_image_upload_path),
        ),
    ]