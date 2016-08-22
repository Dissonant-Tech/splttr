from django.contrib.auth.models import User

from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # extending the deault model
    bg_img = models.URLField(null=True, blank=True)  # Url Field for the bg image
    full_name = models.CharField(max_length=45, null=True, blank=True)


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
    members = models.ManyToManyField(User)


class Event(models.Model):
    name = models.CharField(
        max_length=60
    )
    description = models.CharField(
        max_length=240
    )
    created = models.DateTimeField(
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
        on_delete=models.DO_NOTHING,
        null=True
    )
    a_debtor = models.CharField(
        max_length=60,
        null=True
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE
    )
    created = models.DateTimeField(
            auto_now_add=True
    )
    amount = models.DecimalField(max_digits=6, decimal_places=2)
