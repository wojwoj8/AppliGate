# Generated by Django 4.2.3 on 2023-08-28 08:50

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("user_app", "0015_user_professional_summary"),
    ]

    operations = [
        migrations.AlterField(
            model_name="usercourse",
            name="finish_date",
            field=models.DateField(default="2137-12-01"),
            preserve_default=False,
        ),
    ]
