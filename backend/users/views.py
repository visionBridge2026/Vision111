from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health_check(request):
    """
    Simple endpoint used to verify that the VisionBridge
    backend is running correctly.
    """
    return Response({
        "status": "success",
        "message": "VisionBridge backend is running.",
    })