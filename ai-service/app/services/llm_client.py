"""LLM client for deep stock analysis using Claude Sonnet."""

import json
import logging
from typing import Any, Optional

from ..config import settings

logger = logging.getLogger(__name__)

try:
    import anthropic
except ImportError:
    anthropic = None  # type: ignore[assignment]
    logger.warning("anthropic package not installed; LLM deep analysis will return defaults.")


class LLMClient:
    """Perform comprehensive stock analysis via Claude Sonnet."""

    SONNET_MODEL = "claude-sonnet-4-5-20250929"

    def __init__(self) -> None:
        self._client: Optional["anthropic.AsyncAnthropic"] = None
        if anthropic and settings.anthropic_api_key:
            self._client = anthropic.AsyncAnthropic(
                api_key=settings.anthropic_api_key,
            )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def deep_analysis(
        self,
        symbol: str,
        technical_data: dict[str, Any],
        sentiment_data: dict[str, Any],
        price: float,
    ) -> dict[str, Any]:
        """Run a comprehensive analysis combining technicals and sentiment.

        Returns a dict with keys:
            signal, confidence, reasoning, risk_level,
            price_target, stop_loss, technical_summary, sentiment_summary
        """
        if self._client is None:
            logger.info("Anthropic API key not configured; returning default HOLD analysis.")
            return self._default_analysis(symbol, price)

        prompt = self._build_prompt(symbol, technical_data, sentiment_data, price)

        try:
            response = await self._client.messages.create(
                model=self.SONNET_MODEL,
                max_tokens=2048,
                messages=[{"role": "user", "content": prompt}],
            )

            raw_text = response.content[0].text.strip()
            # Strip markdown code fences if present
            if raw_text.startswith("```"):
                raw_text = raw_text.split("\n", 1)[-1]
                if raw_text.endswith("```"):
                    raw_text = raw_text[: -len("```")].strip()

            parsed: dict = json.loads(raw_text)
            return self._normalise_response(parsed, symbol, price)

        except Exception:
            logger.exception("Error during LLM deep analysis; returning defaults.")
            return self._default_analysis(symbol, price)

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _build_prompt(
        symbol: str,
        technical_data: dict[str, Any],
        sentiment_data: dict[str, Any],
        price: float,
    ) -> str:
        tech_summary = "\n".join(f"  {k}: {v}" for k, v in technical_data.items())
        sent_summary = "\n".join(f"  {k}: {v}" for k, v in sentiment_data.items())

        return (
            "You are a professional stock analyst. Analyse the following data "
            f"for {symbol} (current price: ${price:.2f}) and provide a "
            "comprehensive trading recommendation.\n\n"
            "TECHNICAL INDICATORS:\n"
            f"{tech_summary}\n\n"
            "SENTIMENT DATA:\n"
            f"{sent_summary}\n\n"
            "Provide your analysis as a JSON object with EXACTLY these keys:\n"
            '  "signal": one of "BUY", "SELL", or "HOLD"\n'
            '  "confidence": float between 0 and 1\n'
            '  "reasoning": detailed multi-sentence reasoning\n'
            '  "risk_level": one of "LOW", "MEDIUM", or "HIGH"\n'
            '  "price_target": suggested price target as a float or null\n'
            '  "stop_loss": suggested stop loss as a float or null\n'
            '  "technical_summary": one-paragraph technical analysis summary\n'
            '  "sentiment_summary": one-paragraph sentiment analysis summary\n\n'
            "Respond with ONLY the JSON object. No additional text."
        )

    @staticmethod
    def _normalise_response(
        parsed: dict, symbol: str, price: float
    ) -> dict[str, Any]:
        """Ensure the parsed LLM response has all required keys with valid values."""
        signal = str(parsed.get("signal", "HOLD")).upper()
        if signal not in ("BUY", "SELL", "HOLD"):
            signal = "HOLD"

        confidence = float(parsed.get("confidence", 0.5))
        confidence = max(0.0, min(1.0, confidence))

        risk_level = str(parsed.get("risk_level", "MEDIUM")).upper()
        if risk_level not in ("LOW", "MEDIUM", "HIGH"):
            risk_level = "MEDIUM"

        price_target = parsed.get("price_target")
        if price_target is not None:
            try:
                price_target = float(price_target)
            except (TypeError, ValueError):
                price_target = None

        stop_loss = parsed.get("stop_loss")
        if stop_loss is not None:
            try:
                stop_loss = float(stop_loss)
            except (TypeError, ValueError):
                stop_loss = None

        return {
            "signal": signal,
            "confidence": confidence,
            "reasoning": str(parsed.get("reasoning", "Analysis completed.")),
            "risk_level": risk_level,
            "price_target": price_target,
            "stop_loss": stop_loss,
            "technical_summary": str(
                parsed.get("technical_summary", "No technical summary available.")
            ),
            "sentiment_summary": str(
                parsed.get("sentiment_summary", "No sentiment summary available.")
            ),
        }

    @staticmethod
    def _default_analysis(symbol: str, price: float) -> dict[str, Any]:
        return {
            "signal": "HOLD",
            "confidence": 0.5,
            "reasoning": (
                f"Unable to perform deep analysis for {symbol} because the "
                "Anthropic API key is not configured. Defaulting to HOLD. "
                "Please set the ANTHROPIC_API_KEY environment variable to "
                "enable AI-powered analysis."
            ),
            "risk_level": "MEDIUM",
            "price_target": None,
            "stop_loss": None,
            "technical_summary": "Technical analysis data available but LLM analysis unavailable.",
            "sentiment_summary": "Sentiment analysis unavailable without API key.",
        }
