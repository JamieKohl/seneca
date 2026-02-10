"""Sentiment analysis service using Claude API."""

import json
import logging
from typing import Optional

from ..config import settings
from ..models.schemas import ArticleInput, SentimentResponse

logger = logging.getLogger(__name__)

# Import Anthropic client lazily to avoid hard failure if the package is
# installed but the API key is missing.
try:
    import anthropic
except ImportError:
    anthropic = None  # type: ignore[assignment]
    logger.warning("anthropic package not installed; sentiment analysis will return neutral defaults.")


class SentimentAnalyzer:
    """Analyse news article sentiment using Claude Haiku."""

    HAIKU_MODEL = "claude-haiku-4-5-20251001"

    def __init__(self) -> None:
        self._client: Optional["anthropic.AsyncAnthropic"] = None
        if anthropic and settings.anthropic_api_key:
            self._client = anthropic.AsyncAnthropic(
                api_key=settings.anthropic_api_key,
            )

    # ------------------------------------------------------------------
    # Public helpers
    # ------------------------------------------------------------------

    async def analyze_articles(
        self, articles: list[ArticleInput]
    ) -> list[SentimentResponse]:
        """Return per-article sentiment classifications.

        If the Anthropic API key is not configured, every article is
        classified as *neutral* with a score of ``0.0``.
        """
        if not articles:
            return []

        if self._client is None:
            logger.info(
                "Anthropic API key not configured; returning neutral defaults."
            )
            return [
                SentimentResponse(
                    headline=a.headline,
                    sentiment="neutral",
                    score=0.0,
                )
                for a in articles
            ]

        # Build the prompt
        articles_text = "\n".join(
            f'{i + 1}. Headline: "{a.headline}"\n   Summary: "{a.summary}"'
            for i, a in enumerate(articles)
        )

        prompt = (
            "You are a financial sentiment analyst. For each of the following "
            "news articles, classify the sentiment as exactly one of: "
            "bullish, bearish, or neutral. Also provide a numeric score from "
            "-1.0 (most bearish) to 1.0 (most bullish).\n\n"
            f"{articles_text}\n\n"
            "Respond with ONLY a JSON array where each element has the keys: "
            '"headline" (string), "sentiment" (string), and "score" (float). '
            "Do not include any text outside the JSON array."
        )

        try:
            response = await self._client.messages.create(
                model=self.HAIKU_MODEL,
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )

            raw_text = response.content[0].text.strip()
            # Handle possible markdown code fences
            if raw_text.startswith("```"):
                raw_text = raw_text.split("\n", 1)[-1]
                if raw_text.endswith("```"):
                    raw_text = raw_text[: -len("```")].strip()

            parsed: list[dict] = json.loads(raw_text)

            results: list[SentimentResponse] = []
            for item in parsed:
                sentiment = str(item.get("sentiment", "neutral")).lower()
                if sentiment not in ("bullish", "bearish", "neutral"):
                    sentiment = "neutral"
                score = float(item.get("score", 0.0))
                score = max(-1.0, min(1.0, score))
                results.append(
                    SentimentResponse(
                        headline=str(item.get("headline", "")),
                        sentiment=sentiment,
                        score=score,
                    )
                )
            return results

        except Exception:
            logger.exception("Error during sentiment analysis; returning neutral defaults.")
            return [
                SentimentResponse(
                    headline=a.headline,
                    sentiment="neutral",
                    score=0.0,
                )
                for a in articles
            ]

    async def get_aggregate_sentiment(
        self, articles: list[ArticleInput]
    ) -> tuple[str, float]:
        """Return ``(overall_sentiment, average_score)`` across all articles.

        The overall sentiment string is *bullish*, *bearish*, or *neutral*
        based on the weighted average score.
        """
        if not articles:
            return "neutral", 0.0

        results = await self.analyze_articles(articles)
        if not results:
            return "neutral", 0.0

        total_score = sum(r.score for r in results)
        avg_score = total_score / len(results)

        if avg_score > 0.15:
            overall = "bullish"
        elif avg_score < -0.15:
            overall = "bearish"
        else:
            overall = "neutral"

        return overall, round(avg_score, 4)
