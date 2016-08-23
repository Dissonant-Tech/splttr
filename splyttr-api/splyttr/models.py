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
    created = models.DateField(
        auto_now_add=True
    )
    members = models.ManyToManyField(User)


class QuickEvent(Tab):
    pass


class Event(QuickEvent):
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
    sub_members = models.ForeignKey(
                User,
                related_name="sub_members",
    )


class QuickBill(models.Model):
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
    qevent = models.ForeignKey(
        QuickEvent,
        on_delete=models.CASCADE
    )
    amount = models.DecimalField(max_digits=6, decimal_places=2)


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
    amount = models.DecimalField(max_digits=6, decimal_places=2)
