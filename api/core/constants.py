from __future__ import unicode_literals

INTEGER = "int"
STRING = "unicode"
BOOLEAN = "bool"
FLOAT = "float"

FLAGSMITH_SIGNATURE_HEADER = "X-Flagsmith-Signature"

FLAGSMITH_UPDATED_AT_HEADER = "X-Flagsmith-Document-Updated-At"

NON_FUNCTIONAL_ENDPOINTS = ("/health", "")

SDK_ENDPOINTS = (
    "/api/v1/flags",
    "/api/v1/identities",
    "/api/v1/traits",
    "/api/v1/traits/bulk",
    "/api/v1/traits/increment-value",
    "/api/v1/environment-document",
    "/api/v1/analytics/flags",
)
