"""FastAPI application entry point for the Kohlcorp Shield AI Service."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import health, scam

app = FastAPI(
    title="Kohlcorp Shield AI Service",
    version="2.0.0",
    description="Microservice for scam analysis and consumer protection.",
)

# ---------------------------------------------------------------------------
# CORS middleware
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://kohlcorp.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Include routers
# ---------------------------------------------------------------------------
app.include_router(scam.router)
app.include_router(health.router)


# ---------------------------------------------------------------------------
# Root endpoint
# ---------------------------------------------------------------------------
@app.get("/")
async def root() -> dict[str, str]:
    """Return a welcome message for the Shield AI Service."""
    return {
        "message": "Welcome to the Kohlcorp Shield AI Service",
        "docs": "/docs",
        "version": "2.0.0",
    }
