# Generated by Django 4.2.3 on 2023-11-16 09:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('company_app', '0027_jobofferwhatweoffer'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='joboffer',
            name='application_process',
        ),
        migrations.CreateModel(
            name='JobOfferApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job_application_process', models.CharField(max_length=100)),
                ('job_offer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='company_app.joboffer')),
            ],
        ),
    ]