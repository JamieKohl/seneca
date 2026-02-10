"""Signal generator combining technical, sentiment, and LLM analysis."""

import logging
from typing import Any, Optional

from ..models.schemas import ArticleInput, CandleData, SignalResponse
from .technical import TechnicalAnalyzer
from .sentiment import SentimentAnalyzer
from .llm_client import LLMClient

logger = logging.getLogger(__name__)


class SignalGenerator:
    """Orchestrate all analysis layers and produce a final trading signal."""

    TECHNICAL_WEIGHT = 0.45
    SENTIMENT_WEIGHT = 0.20
    LLM_WEIGHT = 0.35

    def __init__(self) -> None:
        self.technical = TechnicalAnalyzer()
        self.sentiment = SentimentAnalyzer()
        self.llm = LLMClient()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def generate_signal(
        self,
        symbol: str,
        candles: list[CandleData],
        articles: Optional[list[ArticleInput]] = None,
    ) -> SignalResponse:
        """Generate a composite trading signal for *symbol*.

        Steps
        -----
        1. Technical analysis on *candles*.
        2. Sentiment analysis on *articles* (if provided).
        3. Deep LLM analysis combining both datasets.
        4. Weighted combination of scores.
        5. Final signal determination.
        """
        # --- 0. If candles are empty, attempt yfinance fallback -----------
        if not candles:
            candles = self._fetch_candles_fallback(symbol)

        # --- 1. Technical analysis ----------------------------------------
        indicators = self.technical.analyze(candles)
        tech_signal, tech_confidence = self.technical.get_signal_from_technicals(indicators)
        tech_score = self._signal_to_score(tech_signal, tech_confidence)

        # --- 2. Sentiment analysis ----------------------------------------
        sentiment_score = 0.0
        overall_sentiment = "neutral"
        if articles:
            overall_sentiment, sentiment_score = await self.sentiment.get_aggregate_sentiment(articles)

        # --- 3. LLM deep analysis ----------------------------------------
        current_price = indicators.get("current_price", 0.0)
        sentiment_data: dict[str, Any] = {
            "overall_sentiment": overall_sentiment,
            "sentiment_score": sentiment_score,
            "num_articles_analysed": len(articles) if articles else 0,
        }
        llm_result = await self.llm.deep_analysis(
            symbol=symbol,
            technical_data=indicators,
            sentiment_data=sentiment_data,
            price=current_price,
        )
        llm_score = self._signal_to_score(
            llm_result.get("signal", "HOLD"),
            llm_result.get("confidence", 0.5),
        )

        # --- 4. Weighted combination -------------------------------------
        combined_score = (
            tech_score * self.TECHNICAL_WEIGHT
            + sentiment_score * self.SENTIMENT_WEIGHT
            + llm_score * self.LLM_WEIGHT
        )

        # --- 5. Final signal determination --------------------------------
        if combined_score > 0.3:
            final_signal = "BUY"
        elif combined_score < -0.3:
            final_signal = "SELL"
        else:
            final_signal = "HOLD"

        final_confidence = min(1.0, abs(combined_score))

        # Determine risk level from LLM result or derive from confidence
        risk_level = llm_result.get("risk_level", "MEDIUM")

        # Build technical summary
        technical_summary = llm_result.get(
            "technical_summary",
            (
                f"RSI: {indicators.get('rsi', 50):.1f}, "
                f"MACD Histogram: {indicators.get('macd_histogram', 0):.4f}, "
                f"SMA20: {indicators.get('sma_20', 0):.2f}, "
                f"SMA50: {indicators.get('sma_50', 0):.2f}, "
                f"Technical signal: {tech_signal} (confidence: {tech_confidence:.2f})"
            ),
        )

        sentiment_summary = llm_result.get(
            "sentiment_summary",
            f"Overall sentiment: {overall_sentiment} (score: {sentiment_score:.2f})",
        )

        reasoning = llm_result.get(
            "reasoning",
            (
                f"Combined analysis for {symbol}: "
                f"technical={tech_signal}({tech_confidence:.2f}), "
                f"sentiment={overall_sentiment}({sentiment_score:.2f}), "
                f"LLM={llm_result.get('signal', 'HOLD')}({llm_result.get('confidence', 0.5):.2f}). "
                f"Weighted score: {combined_score:.4f}."
            ),
        )

        return SignalResponse(
            symbol=symbol,
            signal_type=final_signal,
            confidence=round(final_confidence, 4),
            reasoning=reasoning,
            technical_summary=technical_summary,
            sentiment_summary=sentiment_summary,
            risk_level=risk_level,
            price_target=llm_result.get("price_target"),
            stop_loss=llm_result.get("stop_loss"),
        )

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _signal_to_score(signal: str, confidence: float) -> float:
        """Convert a signal string + confidence to a numeric score in [-1, 1]."""
        direction = {"BUY": 1.0, "SELL": -1.0, "HOLD": 0.0}.get(
            signal.upper(), 0.0
        )
        return direction * confidence

    @staticmethod
    def _fetch_candles_fallback(symbol: str) -> list[CandleData]:
        """Attempt to fetch recent candle data via yfinance.

        Returns an empty list if yfinance is unavailable or the download
        fails.
        """
        try:
            import yfinance as yf

            ticker = yf.Ticker(symbol)
            df = ticker.history(period="3mo", interval="1d")
            if df.empty:
                return []

            candles: list[CandleData] = []
            for ts, row in df.iterrows():
                candles.append(
                    CandleData(
                        time=int(ts.timestamp()),
                        open=float(row["Open"]),
                        high=float(row["High"]),
                        low=float(row["Low"]),
                        close=float(row["Close"]),
                        volume=float(row["Volume"]),
                    )
                )
            return candles

        except Exception:
            logger.warning(
                "yfinance fallback failed for %s; proceeding with empty candles.",
                symbol,
            )
            return []
