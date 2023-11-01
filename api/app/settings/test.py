from app.settings.common import *  # noqa
from app.settings.common import REST_FRAMEWORK

# We dont want to track tests
ENABLE_TELEMETRY = False
DEFAULT_THROTTLE_CLASSES = ["core.AdminRateThrottle"]
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {
    "login": "100/min",
    "mfa_code": "5/min",
    "invite": "10/min",
    "signup": "100/min",
    "user": "100000/day",
}
