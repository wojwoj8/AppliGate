# Generated by Django 4.2.3 on 2023-11-04 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company_app', '0008_joboffer_contract_type_joboffer_position_level_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='joboffer',
            name='contract_type',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='joboffer',
            name='position_level',
            field=models.CharField(max_length=100),
        ),
    ]
