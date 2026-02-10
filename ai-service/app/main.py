"""FastAPI application entry point for the AI Trader Service."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import analysis, signals, sentiment, health

app = FastAPI(
    title="AI Trader Service",
    version="1.0.0",
    description="Microservice for stock analysis and trading signal generation.",
)

# ---------------------------------------------------------------------------
# CORS middleware -- allow all origins during development
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Include routers
# ---------------------------------------------------------------------------
app.include_router(analysis.router)
app.include_router(signals.router)
app.include_router(sentiment.router)
app.include_router(health.router)


# ---------------------------------------------------------------------------
# Root endpoint
# ---------------------------------------------------------------------------
@app.get("/")
async def root() -> dict[str, str]:
    """Return a welcome message for the AI Trader Service."""
    return {
        "message": "Welcome to the AI Trader Service",
        "docs": "/docs",
        "version": "1.0.0",
    }
