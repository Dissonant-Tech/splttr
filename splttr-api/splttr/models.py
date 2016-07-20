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
            auto_now_add=True
            )
    members = models.ManyToManyField(User)



class Event(models.Model):

    name = models.CharField(
            max_length=60
            )
    description = models.CharField(
            max_length=240
            )
    created = models.DateField(
            auto_now_add=True
            )
    tab = models.ForeignKey(
            Tab, 
            on_delete=models.CASCADE
            )


class Bill(models.Model):

    creditor = models.ForeignKey(
            User,
            related_name='+',
            on_delete=models.DO_NOTHING
            )
    debtor = models.ForeignKey(
            User,
            on_delete=models.DO_NOTHING
            )
    event = models.ForeignKey(
            Event,
            on_delete=models.CASCADE
            )
    amount = models.DecimalField(max_digits=6, decimal_places=2)
