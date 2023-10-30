from django.conf import settings
from django.core.cache import caches
from rest_framework.throttling import UserRateThrottle


class AdminRateThrottle(UserRateThrottle):
    cache = caches[settings.ADMIN_THROTTLE_CACHE_NAME]
    scope = "user"
