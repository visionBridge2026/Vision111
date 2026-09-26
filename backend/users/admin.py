from django.contrib import admin

from .models import Device, UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "role",
        "phone_number",
        "created_at",
    )

    list_filter = (
        "role",
    )

    search_fields = (
        "user__username",
        "user__email",
        "phone_number",
    )


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "device_id",
        "owner",
        "is_active",
        "is_paired",
        "last_seen",
    )

    list_filter = (
        "is_active",
        "is_paired",
    )

    search_fields = (
        "name",
        "device_id",
    )

    readonly_fields = (
        "device_id",
        "created_at",
        "updated_at",
        "last_seen",
    )