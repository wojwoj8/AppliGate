# Generated by Django 4.2.3 on 2023-11-14 17:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('company_app', '0026_remove_jobofferrequirement_requirement_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='JobOfferWhatWeOffer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job_whatweoffer', models.CharField(max_length=150)),
                ('job_offer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='company_app.joboffer')),
            ],
        ),
    ]
