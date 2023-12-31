# Generated by Django 4.2.3 on 2023-11-05 15:44

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company_app', '0015_joboffer_svg_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='joboffer',
            name='background_color',
            field=models.CharField(blank=True, default='#ff0000', max_length=7, validators=[django.core.validators.RegexValidator(message='Enter a valid hexadecimal color code. (e.g. #RRGGBB or #RGB)', regex='^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]),
        ),
        migrations.AlterField(
            model_name='joboffer',
            name='svg_color',
            field=models.CharField(blank=True, default='#ffffff', max_length=7, validators=[django.core.validators.RegexValidator(message='Enter a valid hexadecimal color code. (e.g. #RRGGBB or #RGB)', regex='^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]),
        ),
    ]
