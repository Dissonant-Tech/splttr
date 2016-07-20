from django.contrib.auth.models import User, Group
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'url', 'password', 'username', 'email', 'groups')
        write_only_fields = ('password',)

    def create(self, validated_data):

        user = User.objects.create(
            username=validated_data['username'],
            username=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

        return user


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')
