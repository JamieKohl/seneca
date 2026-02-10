"""Pydantic models for request/response schemas."""

from typing import Optional
from pydantic import BaseModel, Field


class CandleData(BaseModel):
    """Single candlestick data point."""

    time: int = Field(..., description="Unix timestamp")
    open: float = Field(..., description="Opening price")
    high: float = Field(..., description="High price")
    low: float = Field(..., description="Low price")
    close: float = Field(..., description="Closing price")
    volume: float = Field(..., description="Trading volume")


class AnalyzeRequest(BaseModel):
    """Request body for single stock analysis."""

    symbol: str = Field(..., description="Stock ticker symbol", examples=["AAPL"])
    candles: list[CandleData] = Field(
        default_factory=list, description="Historical candle data"
    )


class SignalResponse(BaseModel):
    """Response containing a trading signal."""

    symbol: str = Field(..., description="Stock ticker symbol")
    signal_type: str = Field(
        ..., description="Trading signal: BUY, SELL, or HOLD"
    )
    confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence score between 0 and 1"
    )
    reasoning: str = Field(..., description="Detailed reasoning for the signal")
    technical_summary: str = Field(
        ..., description="Summary of technical analysis"
    )
    sentiment_summary: str = Field(
        ..., description="Summary of sentiment analysis"
    )
    risk_level: str = Field(
        ..., description="Risk assessment: LOW, MEDIUM, or HIGH"
    )
    price_target: Optional[float] = Field(
        None, description="Suggested price target"
    )
    stop_loss: Optional[float] = Field(
        None, description="Suggested stop loss level"
    )


class ArticleInput(BaseModel):
    """Single news article for sentiment analysis."""

    headline: str = Field(..., description="Article headline")
    summary: str = Field(..., description="Article summary or snippet")


class SentimentRequest(BaseModel):
    """Request body for sentiment analysis."""

    articles: list[ArticleInput] = Field(
        ..., description="List of articles to analyze"
    )


class SentimentResponse(BaseModel):
    """Sentiment analysis result for a single article."""

    headline: str = Field(..., description="Original article headline")
    sentiment: str = Field(
        ..., description="Sentiment classification: bullish, bearish, or neutral"
    )
    score: float = Field(
        ..., ge=-1.0, le=1.0, description="Sentiment score from -1 (bearish) to 1 (bullish)"
    )


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = Field(..., description="Service status")
    version: str = Field(..., description="Service version")
    uptime: float = Field(..., description="Uptime in seconds")


class SignalGenerateRequest(BaseModel):
    """Request body for generating signals for multiple symbols."""

    symbols: list[str] = Field(
        ..., description="List of stock ticker symbols", examples=[["AAPL", "MSFT"]]
    )
