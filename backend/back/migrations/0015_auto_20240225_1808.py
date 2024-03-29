# Generated by Django 3.2.23 on 2024-02-25 18:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('back', '0014_alter_avatar_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='avatar',
            name='image_url',
            field=models.URLField(default=''),
        ),
        migrations.AlterField(
            model_name='avatar',
            name='image',
            field=models.ImageField(upload_to='avatars'),
        ),
    ]
