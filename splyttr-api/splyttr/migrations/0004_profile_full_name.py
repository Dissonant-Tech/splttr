# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-25 23:21
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('splyttr', '0003_profile'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='full_name',
            field=models.CharField(blank=True, max_length=45, null=True),
        ),
    ]