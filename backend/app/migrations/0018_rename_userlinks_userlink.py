# Generated by Django 4.2.3 on 2023-08-08 09:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0017_user_about_me_userskill_userlinks_userlanguage'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UserLinks',
            new_name='UserLink',
        ),
    ]
