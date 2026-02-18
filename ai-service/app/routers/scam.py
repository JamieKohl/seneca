"""Router for scam analysis endpoints."""

import json
import logging
from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from ..config import settings

logger = logging.getLogger(__name__)

try:
    import anthropic
except ImportError:
    anthropic = None
    logger.warning("anthropic package not installed; scam analysis will use fallback.")

router = APIRouter(prefix="/analyze", tags=["analyze"])


class ScamAnalyzeRequest(BaseModel):
    """Request body for scam analysis."""
    type: str = Field(..., description="Type: call, text, or email")
    content: str = Field(..., description="The suspicious message content")
    sender: Optional[str] = Field(None, description="Sender info (phone, email)")


class ScamAnalyzeResponse(BaseModel):
    """Response from scam analysis."""
    riskScore: int = Field(..., ge=0, le=100, description="Risk score 0-100")
    riskLevel: str = Field(..., description="low, medium, high, or critical")
    category: str = Field(..., description="Scam category")
    redFlags: list[str] = Field(default_factory=list, description="Identified red flags")
    analysis: str = Field(..., description="Full analysis text")
    recommendedAction: str = Field(..., description="block, report, or ignore")


@router.post("/scam", response_model=ScamAnalyzeResponse)
async def analyze_scam(request: ScamAnalyzeRequest) -> ScamAnalyzeResponse:
    """Analyze a suspicious message for scam indicators using Claude."""

    client = None
    if anthropic and settings.anthropic_api_key:
        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    if client:
        try:
            prompt = (
                "You are a cybersecurity expert specializing in consumer fraud detection. "
                f"Analyze the following {request.type} message for scam indicators.\n\n"
                f"Message type: {request.type}\n"
            )
            if request.sender:
                prompt += f"Sender: {request.sender}\n"
            prompt += (
                f"Content:\n---\n{request.content}\n---\n\n"
                "Provide your analysis as a JSON object with EXACTLY these keys:\n"
                '  "riskScore": integer 0-100 (0=safe, 100=definite scam)\n'
                '  "riskLevel": one of "low", "medium", "high", "critical"\n'
                '  "category": one of "phishing", "impersonation", "lottery", "tech_support", "romance", "investment", "other"\n'
                '  "redFlags": array of specific red flags found (strings)\n'
                '  "analysis": detailed multi-sentence analysis explaining your assessment\n'
                '  "recommendedAction": one of "block", "report", "ignore"\n\n'
                "Respond with ONLY the JSON object. No additional text."
            )

            response = await client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )

            raw_text = response.content[0].text.strip()
            if raw_text.startswith("```"):
                raw_text = raw_text.split("\n", 1)[-1]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3].strip()

            parsed = json.loads(raw_text)

            return ScamAnalyzeResponse(
                riskScore=max(0, min(100, int(parsed.get("riskScore", 50)))),
                riskLevel=parsed.get("riskLevel", "medium"),
                category=parsed.get("category", "other"),
                redFlags=parsed.get("redFlags", []),
                analysis=parsed.get("analysis", "Analysis completed."),
                recommendedAction=parsed.get("recommendedAction", "report"),
            )

        except Exception:
            logger.exception("Error during scam analysis; using fallback.")

    # Fallback analysis without AI
    return _fallback_analysis(request)


def _fallback_analysis(request: ScamAnalyzeRequest) -> ScamAnalyzeResponse:
    """Simple rule-based fallback when AI is unavailable."""
    red_flags = []
    content_lower = request.content.lower()

    checks = [
        (["urgent", "immediately", "right now", "act fast"], "Creates false urgency"),
        (["click", "link", "http", "www."], "Contains suspicious links"),
        (["verify", "confirm your"], "Requests account verification"),
        (["password", "ssn", "social security", "credit card"], "Asks for sensitive information"),
        (["won", "prize", "lottery", "congratulations"], "Promises unexpected prizes"),
        (["irs", "government", "fbi", "police"], "Impersonates a government agency"),
        (["suspended", "locked", "disabled", "compromised"], "Claims account is compromised"),
        (["wire transfer", "gift card", "bitcoin", "crypto"], "Requests unusual payment method"),
    ]

    for keywords, flag in checks:
        if any(kw in content_lower for kw in keywords):
            red_flags.append(flag)

    risk_score = min(100, len(red_flags) * 18 + 15)
    risk_level = "critical" if risk_score >= 80 else "high" if risk_score >= 60 else "medium" if risk_score >= 30 else "low"

    category = "other"
    if any(w in content_lower for w in ["bank", "account", "verify", "paypal"]):
        category = "phishing"
    elif any(w in content_lower for w in ["irs", "government", "police", "fbi"]):
        category = "impersonation"
    elif any(w in content_lower for w in ["won", "lottery", "prize"]):
        category = "lottery"
    elif any(w in content_lower for w in ["invest", "crypto", "bitcoin", "trading"]):
        category = "investment"
    elif any(w in content_lower for w in ["tech support", "microsoft", "apple support"]):
        category = "tech_support"

    recommended_action = "block" if risk_score >= 60 else "report" if risk_score >= 30 else "ignore"

    return ScamAnalyzeResponse(
        riskScore=risk_score,
        riskLevel=risk_level,
        category=category,
        redFlags=red_flags,
        analysis=(
            f"This {request.type} "
            f"{'appears relatively safe' if risk_level == 'low' else f'shows {len(red_flags)} red flag(s) commonly associated with {category} scams'}. "
            f"{'No major red flags detected.' if not red_flags else f'Key concerns: {', '.join(red_flags)}.'} "
            f"Recommended action: {recommended_action}."
        ),
        recommendedAction=recommended_action,
    )
