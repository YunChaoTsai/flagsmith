# Generated by Django 3.2.20 on 2023-07-26 13:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('feature_versioning', '0001_add_environment_feature_state_version_logic'),
        ('features', '0059_fix_feature_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='featurestate',
            name='environment_feature_version',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='feature_states', to='feature_versioning.environmentfeatureversion'),
        ),
        migrations.AddField(
            model_name='historicalfeaturestate',
            name='environment_feature_version',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='feature_versioning.environmentfeatureversion'),
        ),
    ]
