from django.contrib.auth.models import User, Group
from splttr.models import Tab, Event, Bill, Profile
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    bg_img = serializers.URLField(source='profile.bg_img', allow_blank=True)  # Telling Django to use profile instead
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
    class Meta:
        model = Tab
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = '__all__'
