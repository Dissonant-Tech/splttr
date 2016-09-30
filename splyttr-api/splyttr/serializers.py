from django.contrib.auth.models import User, Group
from splyttr.models import Tab, Event, Bill, Profile
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    bg_img = serializers.URLField(source='profile.bg_img', allow_null=True,  allow_blank=True)  # Telling Django to use profile instead
    full_name = serializers.CharField(source='profile.full_name', allow_null=True, allow_blank=True)  # Same

    class Meta:
        model = User
        fields = ('id', 'url', 'password', 'username',  'email', 'full_name', 'bg_img', 'groups')
        write_only_fields = ('password',)

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', None)  # Using our profile as the validated
        user = super(UserSerializer, self).create(validated_data)  # Using default user to create
        user.set_password(validated_data['password'])
        user.save()
        self.create_or_update_profile(user, profile_data)
        return user

    def update(self, instance, validated_data):  # Allowing for updates to the custom fields
        profile_data = validated_data.pop('profile', None)
        self.create_or_update_profile(instance, profile_data)
        return super(UserSerializer, self).update(instance, validated_data)

    def create_or_update_profile(self, user, profile_data):
        profile, created = Profile.objects.get_or_create(user=user, defaults=profile_data)
        if not created and profile_data is not None:
            super(UserSerializer, self).update(profile, profile_data)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class TabSerializer(serializers.ModelSerializer):

    owner_name = serializers.SerializerMethodField()

    def get_owner_name(self, tab):
        user = User.objects.get(pk=tab.owner.pk)
        return user.username

    class Meta:
        model = Tab
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):

    tab_name = serializers.SerializerMethodField()
    event_bills = serializers.SerializerMethodField()

    def get_tab_name(self, event):
        tab = Tab.objects.get(pk=event.tab.pk)
        return tab.name



    def get_event_bills(self, event):
        bills = Bill.objects.filter(event=event).order_by('-created_at')
        serialized = BillSerializer(bills,
                context={'request':self.context.get('request')},
                many=True
        )
        return serialized.data

    class Meta:
        model = Event
        fields = '__all__'


class BillSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(input_formats=None, read_only=True)
    debtor_info = serializers.SerializerMethodField()
    creditor_info = serializers.SerializerMethodField()

    def get_debtor_info(self, bill):
        debtor = User.objects.filter(pk=bill.debtor.id)
        serialized = UserSerializer(debtor,
                context={'request' : self.context.get('request')},
                many=True
        )
        return serialized.data

    def get_creditor_info(self, bill):
        creditor = User.objects.filter(pk=bill.creditor.id)
        serialized = UserSerializer(creditor,
                context={'request' : self.context.get('request')},
                many=True
        )
        return serialized.data

    class Meta:
        model = Bill
        fields = '__all__'

