"""splyttr URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin

from rest_framework import routers, serializers, viewsets
from rest_auth.views import LoginView, LogoutView, UserDetailsView, PasswordResetView

from splyttr import views
from splyttr.router import HybridRouter


router = HybridRouter()
router.register(r'users', views.UserViewSet, 'user')
router.register(r'tabs', views.TabViewSet, 'tab')
router.register(r'events', views.EventViewSet, 'event')
router.register(r'bills', views.BillViewSet, 'bill')
router.register_include(url(r'^auth/', include('rest_auth.urls', namespace='auth')))
router.register_include(url(r'^auth/registration/', include('rest_auth.registration.urls')))

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^admin', admin.site.urls),
    url(r'^auth/', include('rest_auth.urls')),
    url(r'^auth/registration/', include('rest_auth.registration.urls')),
]