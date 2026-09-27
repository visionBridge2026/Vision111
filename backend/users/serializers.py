from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Device, FamilyMember, UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    class Meta:
        model = UserProfile
        fields = [
            "username",
            "email",
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


class FamilyMemberSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    glasses = DeviceSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = FamilyMember
        fields = [
            "id",
            "full_name",
            "relationship",
            "email",
            "username",
            "glasses",
        ]