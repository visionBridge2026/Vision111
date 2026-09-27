from django.urls import path

from .views import (
    current_user,
    family_dashboard,
    family_login,
    family_register,
    health_check,
    verify_device,
)


urlpatterns = [
    path(
        "health/",
        health_check,
        name="health-check",
    ),

    path(
        "devices/verify/",
        verify_device,
        name="verify-device",
    ),

    path(
        "me/",
        current_user,
        name="current-user",
    ),

    path(
        "family/register/",
        family_register,
        name="family-register",
    ),

    path(
        "family/login/",
        family_login,
        name="family-login",
    ),

    path(
        "family/dashboard/",
        family_dashboard,
        name="family-dashboard",
    ),
]