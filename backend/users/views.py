from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Device
from .serializers import DeviceSerializer, UserProfileSerializer
from rest_framework.permissions import IsAuthenticated

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Return information about the currently authenticated user.
    """

    profile = request.user.profile

    return Response({
        "status": "success",
        "user": UserProfileSerializer(profile).data,
    })


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        "status": "success",
        "message": "VisionBridge backend is running.",
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_device(request):
    """
    Verify a VisionBridge device using its QR information.

    Expected JSON:

    {
        "device_id": "...",
        "pairing_token": "..."
    }
    """

    device_id = request.data.get("device_id")
    pairing_token = request.data.get("pairing_token")

    if not device_id or not pairing_token:
        return Response(
            {
                "status": "error",
                "message": "device_id and pairing_token are required.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        device = Device.objects.select_related(
            "owner",
            "owner__profile",
        ).get(
            device_id=device_id,
            pairing_token=pairing_token,
        )

    except Device.DoesNotExist:
        return Response(
            {
                "status": "error",
                "message": "Invalid VisionBridge device.",
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if not device.is_active:
        return Response(
            {
                "status": "error",
                "message": "This VisionBridge device is inactive.",
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    if not device.owner:
        return Response(
            {
                "status": "error",
                "message": "This device has not been assigned to a user yet.",
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    # Mark the device as paired and update its last activity.
    device.is_paired = True
    device.mark_seen()

    # Create JWT tokens for the device owner.
    refresh = RefreshToken.for_user(device.owner)

    profile = device.owner.profile

    return Response(
        {
            "status": "success",
            "message": "VisionBridge device verified.",

            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },

            "user": UserProfileSerializer(profile).data,

            "device": DeviceSerializer(device).data,
        },
        status=status.HTTP_200_OK,
    )