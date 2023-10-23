from contextlib import suppress

from core.constants import NON_FUNCTIONAL_ENDPOINTS, SDK_ENDPOINTS
from django.conf import settings


def traces_sampler(ctx):
    with suppress(KeyError):
        path_info = ctx["wsgi_environ"]["PATH_INFO"]
        path_info = path_info[:-1] if path_info.endswith("/") else path_info

        if path_info in NON_FUNCTIONAL_ENDPOINTS:
            return 0
        elif path_info not in SDK_ENDPOINTS:
            return settings.DASHBOARD_ENDPOINTS_SENTRY_TRACE_SAMPLE_RATE

    return settings.DEFAULT_SENTRY_TRACE_SAMPLE_RATE
