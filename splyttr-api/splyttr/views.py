from rest_framework import status, viewsets, filters

from rest_framework.decorators import api_view, list_route, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.decorators import detail_route

from django.contrib.auth.models import User, Group
from django.views.generic import RedirectView
from django.core import serializers

from splyttr.serializers import UserSerializer, GroupSerializer, TabSerializer, EventSerializer, BillSerializer
from splyttr.models import Tab, Event, Bill, Profile


@api_view(['GET'])
def get_ocr_view(request):
    return Response({})


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter)
    filter_fields = ('id', 'username', 'email')
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
    permission_classes = (IsAuthenticated,)
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class TabViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tabs to be viewed or edited
    """
    permission_classes = (IsAuthenticated,)
    queryset = Tab.objects.all()
    serializer_class = TabSerializer
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter)
    filter_fields = ('name', 'description', 'created', 'members')

    @detail_route(methods=['GET'])
    def total(self, request, pk=None):

        total = 0 
        bills = Bill.objects.filter(event__tab__pk=pk) # querying for all events with the same tab

        for bill in bills:
            total += bill.amount 

        return Response({
            'total': total
        })


class EventViewSet(viewsets.ModelViewSet):
    """
    Events are the middle of the Splyttr hierarchy. They represent an event or
    occurrance where bills were generated.

    For example, a trip to a local restaurant could be classified as an event.

    Events are grouped by which tab they belong to.
    """
    permission_classes = (IsAuthenticated,)
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter)
    filter_fields = ('name', 'description', 'created', 'tab')

    @detail_route(methods=['GET'])
    def members(self, request, pk=None):

        members = []
        member_list = []

        bills = Bill.objects.filter(event__pk = pk) # Separate all bill of this event
        for bill in bills:
            if bill.a_debtor is not None:
                members.append(bill.a_debtor)
            members.append(bill.creditor)
            members.append(bill.debtor)
            [member_list.append(member.pk) for member in members if member.pk  not in member_list]

        return Response(member_list)

    @detail_route(methods=['GET'])
    def total(self, request, pk=None):
        total = 0

        bills = Bill.objects.filter(event__pk = pk) # Separate all bill of this event
        for bill in bills:
            total += bill.amount

        return Response({
            'total': total
        })


class BillViewSet(viewsets.ModelViewSet):
    """
    Bills are the lowest level of the Splyttr hierarchy. They represent a debt
    or credit between two people.

    Bills are organized by events. Each bill belongs to a specific event, many
    bills can belong to the same event.
    """
    permission_classes = (IsAuthenticated,)
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter)
    filter_fields = ('creditor', 'debtor', 'a_debtor', 'event', 'amount')

