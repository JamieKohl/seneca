"""Router for single-stock analysis endpoint."""

import logging

from fastapi import APIRouter, HTTPException

from ..models.schemas import AnalyzeRequest, SignalResponse
from ..services.signal_generator import SignalGenerator

logger = logging.getLogger(__name__)

router = APIRouter(tags=["analysis"])

_generator = SignalGenerator()


@router.post("/analyze", response_model=SignalResponse)
async def analyze_stock(request: AnalyzeRequest) -> SignalResponse:
    """Analyse a single stock and return a trading signal.

    Accepts a symbol and optional historical candle data. If candle data is
    not provided the service will attempt to fetch it via yfinance.
    """
    try:
        signal = await _generator.generate_signal(
            symbol=request.symbol.upper(),
            candles=request.candles,
        )
        return signal
    except Exception as exc:
        logger.exception("Error analysing %s", request.symbol)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyse {request.symbol}: {str(exc)}",
        ) from exc
