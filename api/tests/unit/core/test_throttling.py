from importlib import reload

from core import throttling as core_throttling
from core.throttling import SDK_ENDPOINTS
from rest_framework import throttling as rest_framework_throttling


def test_admin_rate_throttle_allow_request_sdk_endpoints(rf, settings):
    # Given
    settings.REST_FRAMEWORK = {"DEFAULT_THROTTLE_RATES": {"admin": "1/minute"}}

    # reload the throttling module to ensure the settings are reloaded
    reload(rest_framework_throttling)
    reload(core_throttling)

    # When
    for endpoint in SDK_ENDPOINTS:
        request = rf.get(endpoint)
        request.user = None
        throttle = core_throttling.AdminRateThrottle()

        # Then - requests are allowed
        assert throttle.allow_request(request=request, view=None) is True
        assert throttle.allow_request(request=request, view=None) is True


def test_admin_rate_throttle_allow_request_non_sdk_endpoint(rf, settings, test_user):
    # Given
    settings.REST_FRAMEWORK = {"DEFAULT_THROTTLE_RATES": {"admin": "1/minute"}}

    # reload the throttling module to ensure the settings are reloaded
    reload(rest_framework_throttling)
    reload(core_throttling)

    # When
    request = rf.get("/api/v1/organisations/")
    request.user = test_user
    throttle = core_throttling.AdminRateThrottle()

    # Then - first request should be allowed
    assert throttle.allow_request(request=request, view=None) is True

    # Second request should be throttled
    assert throttle.allow_request(request=request, view=None) is False
