from django.conf import settings
from django.core.cache import caches
from rest_framework.request import Request
from rest_framework.throttling import UserRateThrottle

SDK_ENDPOINTS = [
    "/api/v1/flags/",
    "/api/v1/identities/",
    "/api/v1/traits/",
    "/api/v1/traits/bulk/",
    "/api/v1/traits/increment-value/",
    "/api/v1/environment-document/",
]


class AdminRateThrottle(UserRateThrottle):
    cache = caches[settings.ADMIN_THROTTLE_CACHE]

    def allow_request(self, request: Request, view: object) -> bool:
        if request.path in SDK_ENDPOINTS:
            return True
        return super().allow_request(request, view)
