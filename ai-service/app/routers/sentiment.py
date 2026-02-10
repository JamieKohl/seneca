"""Router for article sentiment analysis endpoint."""

import logging

from fastapi import APIRouter, HTTPException

from ..models.schemas import SentimentRequest, SentimentResponse
from ..services.sentiment import SentimentAnalyzer

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/sentiment", tags=["sentiment"])

_analyzer = SentimentAnalyzer()


@router.post("/analyze", response_model=list[SentimentResponse])
async def analyze_sentiment(request: SentimentRequest) -> list[SentimentResponse]:
    """Analyse the sentiment of the provided news articles.

    Returns a per-article sentiment classification (bullish / bearish /
    neutral) with a numeric score from -1 to 1.
    """
    if not request.articles:
        raise HTTPException(status_code=400, detail="No articles provided.")

    try:
        results = await _analyzer.analyze_articles(request.articles)
        return results
    except Exception as exc:
        logger.exception("Error during sentiment analysis")
        raise HTTPException(
            status_code=500,
            detail=f"Sentiment analysis failed: {str(exc)}",
        ) from exc
