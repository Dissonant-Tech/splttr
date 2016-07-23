from rest_framework import status, viewsets

from rest_framework.decorators import api_view, list_route
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from django.contrib.auth.models import User, Group

from splttr.serializers import UserSerializer, GroupSerializer, TabSerializer, EventSerializer, BillSerializer
from splttr.models import Tab, Event, Bill


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    model = User

    @list_route(methods=['POST'])
    def login(self, request):
        """
        User login/ Aquire token
        ---
        omit_serializer: true
        parameters:
            - name: username
              type: string
            - name: password
              type: string
        """
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token':token.key,
            'user_id': User.objects.get(username=str(user)).pk
            })


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class TabViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tabs to be viewed or edited
    """
    queryset = Tab.objects.all()
    serializer_class = TabSerializer


class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows events to be viewed or edited
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class BillViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows bills to be viewed or edited
    """
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
