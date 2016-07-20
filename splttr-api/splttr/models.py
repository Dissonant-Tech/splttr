from django.contrib.auth.models import User
from django.db import models


class Tab(models.Model):

    name = models.CharField(
            max_length=60
            )
    description = models.CharField(
            max_length=240
            )
    created = models.DateField(
            auto_add_now=True
            )
    members = models.ForeignKey(
            User,
            on_delete=models.SET_NULL,
            null=True
            )


class Event(models.Model);

    name = models.CharField(
            max_length=60
            )
    description = models.CharField(
            max_length=240
            )
    created = models.DateField(
            auto_add_now=True
            )
    tab = models.ForeignKey(
            Tab, 
            on_delete=models.CASCADE
            )
