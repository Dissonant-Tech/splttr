"""
Custom List Mixin
"""
from __future__ import unicode_literals

from rest_framework import status
from rest_framework.response import Response
from rest_framework.settings import api_settings

class CustomListModelMixin(object):
    """
    List a queryset.
    """
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        print(queryset)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
