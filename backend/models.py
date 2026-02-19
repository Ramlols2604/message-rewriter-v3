from pydantic import BaseModel, Field
from typing import List, Optional


class Stats(BaseModel):
    character_count: int
    sentence_count: int
    bullet_count: int


class RewriteRequest(BaseModel):
    text: str = Field(..., max_length=1500)
    context: Optional[str] = Field(default="", max_length=280)
    channel: str = Field(..., pattern="^(Teams|Email)$")
    tone: str = Field(..., pattern="^(Neutral|Friendly|Firm|Diplomatic|Direct|Empathetic)$")
    role_mode: str = Field(..., pattern="^(General|Sales|Support|Engineering|HR)$")
    template: str = Field(..., pattern="^(Quick question|Follow up|Status update|Escalation|Apology and fix)$")
    length: str = Field(..., pattern="^(Short|Normal)$")


class RewriteResponse(BaseModel):
    rewrite_request_id: str
    rewritten_text: str
    what_changed: List[str] = Field(..., min_length=2, max_length=4)
    clarifying_question: str
    confidence: str = Field(..., pattern="^(high|low)$")
    risk_score_input: int
    risk_level_input: str
    risk_reasons_input: List[str]
    risk_score_output: int
    risk_level_output: str
    risk_reasons_output: List[str]
    detected_flags_input: List[str]
    detected_flags_output: List[str]
    stats_before: Stats
    stats_after: Stats


class FeedbackRequest(BaseModel):
    rewrite_request_id: str
    rating: int = Field(..., ge=1, le=5)
    tags: List[str] = Field(default_factory=list)
    note: Optional[str] = Field(default="", max_length=300)
    original_text: Optional[str] = ""
    rewritten_text: Optional[str] = ""
    context: Optional[str] = ""
    channel: Optional[str] = ""
    tone: Optional[str] = ""
    role_mode: Optional[str] = ""
    template: Optional[str] = ""
    length: Optional[str] = ""
