from django.contrib.auth.models import User
from django.utils import timezone

from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # extending the deault model
    bg_img = models.URLField(null=True, blank=True)  # Url Field for the bg image
    full_name = models.CharField(max_length=45, null=True, blank=True)


class Tab(models.Model):
    owner = models.ForeignKey(
            Profile,
            on_delete=models.CASCADE,
            related_name="tabowner",
    )
    name = models.CharField(
        max_length=60
    )
    description = models.CharField(
        max_length=240
    )
    created_at = models.DateTimeField(
            '%m/%d/%Y %H:%M',
            auto_now_add=True,
    )
    members = models.ManyToManyField(User)


class Event(models.Model):
    owner = models.ForeignKey(
            Profile,
            on_delete=models.CASCADE,
            related_name="eventowner",
    )
    name = models.CharField(
        max_length=60
    )
    description = models.CharField(
        max_length=240
    )
    created_at = models.DateTimeField(
            '%m/%d/%Y %H:%M',
            auto_now_add=True,
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
        null=True,
        blank=True,
    )
    a_debtor = models.CharField(
        max_length=60,
        null=True,
        blank=True,
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE
    )
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(
            '%m/%d/%Y %H:%M',
            auto_now_add=True,
    )
    is_paid = models.BooleanField(default=False)
