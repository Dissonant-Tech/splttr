from django.contrib.auth.models import User

from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null = True,
        blank = True
    )
    bg_img = models.URLField(
        null=True,
        blank=True
    )
    full_name = models.CharField(
        max_length=45,
        null=True,
        blank=True
    )


class Tab(models.Model):
    name = models.CharField(
        max_length=60
    )
    description = models.CharField(
        max_length=240
    )
    created = models.DateTimeField(
        auto_now_add=True
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    members = models.ManyToManyField(
        Profile
    )


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
        Profile,
        related_name='+',
        on_delete=models.DO_NOTHING
    )
    debtor = models.ForeignKey(
        Profile,
        on_delete=models.DO_NOTHING,
        null=True
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE
    )
    amount = models.DecimalField(
        max_digits=6,
        decimal_places=2
    )
