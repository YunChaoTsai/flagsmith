# Generated by Django 3.2.20 on 2023-11-02 18:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('environments', '0033_history_upgrade'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalenvironment',
            name='ip_address',
            field=models.GenericIPAddressField(blank=True, null=True),
        ),
    ]
