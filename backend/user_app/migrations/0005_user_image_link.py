# Generated by Django 4.2.3 on 2023-08-09 14:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_app', '0004_remove_userlink_test_alter_userlink_link_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='image_link',
            field=models.CharField(blank=True, default=None, max_length=250, null=True),
        ),
    ]
