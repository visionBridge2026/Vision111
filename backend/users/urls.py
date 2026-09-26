from django.urls import path

from .views import (
    current_user,
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
]