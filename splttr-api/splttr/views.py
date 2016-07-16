from rest_framework import status, viewsets
from rest_framework.decorators import api_view, list_route
from rest_framework.response import Response
from rest_framework.authtoken import views as authview
from django.contrib.auth.models import User, Group

from splttr.serializers import UserSerializer, GroupSerializer



class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

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
        return authview.obtain_auth_token(request)


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
