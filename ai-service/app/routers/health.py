"""Router for the health-check endpoint."""

import time

from fastapi import APIRouter

from ..models.schemas import HealthResponse

router = APIRouter(tags=["health"])

_start_time = time.time()

APP_VERSION = "1.0.0"


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Return the current service health status, version, and uptime."""
    uptime = time.time() - _start_time
    return HealthResponse(
        status="ok",
        version=APP_VERSION,
        uptime=round(uptime, 2),
    )
