# Generated by Django 4.2.3 on 2023-12-11 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company_app', '0043_alter_question_choice_a_alter_question_choice_b_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='choice_a',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='question',
            name='choice_b',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='question',
            name='choice_c',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='question',
            name='choice_d',
            field=models.CharField(max_length=200),
        ),
    ]
