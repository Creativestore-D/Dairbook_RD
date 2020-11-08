from django.contrib import admin
from django.urls import path, include, re_path
from . import views

urlpatterns = [
    re_path(r'^admin', views.admin_panel),
    re_path(r'^', views.user_panel)
    # path('', views.dashboard),
    # re_path(r'^(?:.*)/?$', views.dashboard),

]