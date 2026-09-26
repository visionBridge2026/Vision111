from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Device, UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    class Meta:
        model = UserProfile
        fields = [
            "username",
            "role",
            "phone_number",
        ]


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = [
            "device_id",
            "name",
            "is_active",
            "is_paired",
            "last_seen",
        ]