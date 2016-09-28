from django.contrib import admin
from models import Bill, Event, Tab, Profile


class BillAdmin(admin.ModelAdmin):
    list_display = ['creditor']
    list_filter = ['creditor']

admin.site.register(Bill, BillAdmin)

class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user']
    list_filter = ['user']

admin.site.register(Profile, ProfileAdmin)

class TabAdmin(admin.ModelAdmin):
    list_display = ['owner']
    list_filter = ['owner']

admin.site.register(Tab, TabAdmin)

class EventAdmin(admin.ModelAdmin):
    list_display = ['owner']
    list_filter = ['owner']

admin.site.register(Event, EventAdmin)
