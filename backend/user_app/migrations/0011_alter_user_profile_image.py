# Generated by Django 4.2.3 on 2023-08-17 09:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_app', '0010_user_profile_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_image',
            field=models.ImageField(blank=True, default='defaults/default_profile_image.jpg', upload_to='user_profiles/'),
        ),
    ]