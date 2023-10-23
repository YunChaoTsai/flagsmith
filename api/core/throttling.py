from core.constants import SDK_ENDPOINTS
from django.conf import settings
from django.core.cache import caches
from rest_framework.request import Request
from rest_framework.throttling import UserRateThrottle


class AdminRateThrottle(UserRateThrottle):
    cache = caches[settings.ADMIN_THROTTLE_CACHE_NAME]
    scope = "admin"

    def allow_request(self, request: Request, view: object) -> bool:
        if request.path in SDK_ENDPOINTS:
            return True
        return super().allow_request(request, view)
