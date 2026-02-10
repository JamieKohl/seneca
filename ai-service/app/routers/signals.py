"""Router for multi-symbol signal generation endpoint."""

import asyncio
import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from ..models.schemas import SignalResponse
from ..services.signal_generator import SignalGenerator

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/signals", tags=["signals"])

_generator = SignalGenerator()


@router.get("/generate", response_model=list[SignalResponse])
async def generate_signals(
    symbols: str = Query(
        ...,
        description="Comma-separated list of stock ticker symbols (e.g. AAPL,MSFT,GOOGL)",
    ),
) -> list[SignalResponse]:
    """Generate trading signals for multiple stocks.

    Accepts a comma-separated ``symbols`` query parameter and returns a list
    of signal responses -- one per symbol.
    """
    symbol_list = [s.strip().upper() for s in symbols.split(",") if s.strip()]

    if not symbol_list:
        raise HTTPException(status_code=400, detail="No valid symbols provided.")

    if len(symbol_list) > 20:
        raise HTTPException(
            status_code=400,
            detail="Maximum 20 symbols per request.",
        )

    async def _safe_generate(sym: str) -> Optional[SignalResponse]:
        try:
            return await _generator.generate_signal(symbol=sym, candles=[])
        except Exception:
            logger.exception("Error generating signal for %s", sym)
            return SignalResponse(
                symbol=sym,
                signal_type="HOLD",
                confidence=0.0,
                reasoning=f"Error generating signal for {sym}.",
                technical_summary="Unavailable due to error.",
                sentiment_summary="Unavailable due to error.",
                risk_level="HIGH",
                price_target=None,
                stop_loss=None,
            )

    results = await asyncio.gather(*[_safe_generate(sym) for sym in symbol_list])
    return [r for r in results if r is not None]
