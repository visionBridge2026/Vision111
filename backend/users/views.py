from django.contrib.auth.models import User
from django.db import transaction

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken

from .models import Device, FamilyMember , UserProfile
from .serializers import (
    DeviceSerializer,
    FamilyMemberSerializer,
    UserProfileSerializer,
)


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
    Verify a VisionBridge device using QR information.

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

    device.is_paired = True
    device.mark_seen()

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


@api_view(["POST"])
@permission_classes([AllowAny])
def family_register(request):
    """
    Register a new Family Member and link VisionBridge glasses.

    Expected JSON:

    {
        "full_name": "Sarah Ahmed",
        "email": "sarah@example.com",
        "phone": "+250788000000",
        "relationship": "Daughter",
        "password": "password123",
        "glasses": [
            {
                "device_id": "...",
                "pairing_token": "..."
            }
        ]
    }
    """

    full_name = request.data.get("full_name", "").strip()
    email = request.data.get("email", "").strip().lower()
    phone = request.data.get("phone", "").strip()
    relationship = request.data.get("relationship", "").strip()
    password = request.data.get("password", "")
    glasses = request.data.get("glasses", [])

    # -----------------------------
    # Basic validation
    # -----------------------------

    if not full_name:
        return Response(
            {"message": "Full name is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not email:
        return Response(
            {"message": "Email is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not phone:
        return Response(
            {"message": "Phone number is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not relationship:
        return Response(
            {"message": "Family relationship is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not password:
        return Response(
            {"message": "Password is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(password) < 8:
        return Response(
            {"message": "Password must contain at least 8 characters."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not glasses:
        return Response(
            {"message": "At least one VisionBridge glass must be linked."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # -----------------------------
    # Check email
    # -----------------------------

    if User.objects.filter(email__iexact=email).exists():
        return Response(
            {
                "message": "An account with this email already exists."
            },
            status=status.HTTP_409_CONFLICT,
        )

    # -----------------------------
    # Create account + links
    # -----------------------------

    try:
        with transaction.atomic():

            username = email

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
            )

            profile = user.profile
            profile.role = UserProfile.Role.FAMILY_MEMBER
            profile.phone_number = phone
            profile.save()

            family_member = FamilyMember.objects.create(
                user=user,
                full_name=full_name,
                relationship=relationship,
            )

            devices_to_link = []

            for glass in glasses:

                device_id = glass.get("device_id")
                pairing_token = glass.get("pairing_token")

                if not device_id or not pairing_token:
                    raise ValueError(
                        "Each glass requires device_id and pairing_token."
                    )

                try:
                    device = Device.objects.get(
                        device_id=device_id,
                        pairing_token=pairing_token,
                        is_active=True,
                    )
                except Device.DoesNotExist:
                    raise ValueError(
                        "One of the VisionBridge glasses could not be verified."
                    )

                devices_to_link.append(device)

            family_member.glasses.set(devices_to_link)

            # -----------------------------
            # JWT
            # -----------------------------

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "status": "success",
                    "message": "Family account created successfully.",

                    "tokens": {
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                    },

                    "family_member": FamilyMemberSerializer(
                        family_member
                    ).data,
                },
                status=status.HTTP_201_CREATED,
            )

    except ValueError as error:

        return Response(
            {
                "status": "error",
                "message": str(error),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def family_login(request):
    """
    Login for Family Members.

    Expected JSON:

    {
        "email": "sarah@example.com",
        "password": "password123"
    }
    """

    from django.contrib.auth import authenticate

    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password", "")

    if not email or not password:
        return Response(
            {
                "message": "Email and password are required."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(
        username=email,
        password=password,
    )

    if user is None:
        return Response(
            {
                "message": "Invalid email or password."
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    try:
        profile = user.profile
        family_member = user.family_member
    except (
        UserProfile.DoesNotExist,
        FamilyMember.DoesNotExist,
    ):
        return Response(
            {
                "message": "This account is not a Family Member account."
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    if profile.role != UserProfile.Role.FAMILY_MEMBER:
        return Response(
            {
                "message": "This account is not a Family Member account."
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "status": "success",
            "message": "Family login successful.",

            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },

            "family_member": FamilyMemberSerializer(
                family_member
            ).data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def family_dashboard(request):
    """
    Return the authenticated Family Member and linked glasses.
    """

    try:
        family_member = request.user.family_member
    except FamilyMember.DoesNotExist:
        return Response(
            {
                "message": "Family Member profile not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    return Response(
        {
            "status": "success",
            "family_member": FamilyMemberSerializer(
                family_member
            ).data,
        },
        status=status.HTTP_200_OK,
    )