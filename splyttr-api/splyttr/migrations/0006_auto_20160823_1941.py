# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-23 19:41
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('splyttr', '0005_auto_20160729_0130'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuickBill',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('a_debtor', models.CharField(max_length=60, null=True)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=6)),
                ('creditor', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('debtor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='QuickEvent',
            fields=[
                ('tab_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='splyttr.Tab')),
            ],
            bases=('splyttr.tab',),
        ),
        migrations.AddField(
            model_name='event',
            name='sub_members',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='quickbill',
            name='qevent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='splyttr.QuickEvent'),
        ),
    ]