import pytest
from django.urls import reverse
from pytest_lazyfixture import lazy_fixture
from rest_framework import status


@pytest.mark.parametrize(
    "client",
    [(lazy_fixture("admin_master_api_key_client")), (lazy_fixture("admin_client"))],
)
def test_user_throttle_can_throttle_admin_endpoints(
    client, project, mocker, reset_cache
):
    # Given
    mocker.patch("core.throttling.UserRateThrottle.get_rate", return_value="1/minute")

    url = reverse("api-v1:projects:project-list")

    # Then - first request should be successful
    response = client.get(url, content_type="application/json")
    assert response.status_code == status.HTTP_200_OK

    # Second request should be throttled
    response = client.get(url, content_type="application/json")
    assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
