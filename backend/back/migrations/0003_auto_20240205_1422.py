# Generated by Django 3.2.23 on 2024-02-05 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('back', '0002_user_first_access'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='first_access',
        ),
        migrations.AddField(
            model_name='user',
            name='secret_2auth',
            field=models.CharField(default='', max_length=100),
        ),
    ]