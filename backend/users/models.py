import uuid

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class UserProfile(models.Model):
    class Role(models.TextChoices):
        GLASS_USER = "glass_user", "Glass User"
        FAMILY_MEMBER = "family_member", "Family Member"
        AGENT = "agent", "Agent"

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    role = models.CharField(
        max_length=30,
        choices=Role.choices,
        default=Role.GLASS_USER,
    )

    phone_number = models.CharField(
        max_length=30,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"


class Device(models.Model):
    device_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )

    name = models.CharField(
        max_length=100,
        default="VisionBridge Glasses",
    )

    owner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="visionbridge_devices",
    )

    pairing_token = models.CharField(
        max_length=128,
    )

    is_active = models.BooleanField(
        default=True,
    )

    is_paired = models.BooleanField(
        default=False,
    )

    last_seen = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def mark_seen(self):
        self.last_seen = timezone.now()
        self.save(update_fields=["last_seen"])

    def __str__(self):
        return f"{self.name} ({self.device_id})"