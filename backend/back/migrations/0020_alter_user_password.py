# Generated by Django 3.2.24 on 2024-02-27 22:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('back', '0019_alter_user_password_tournament'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
