import uuid
import logging
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from models import RewriteRequest, RewriteResponse, FeedbackRequest, Stats
from risk_scoring import compute_risk
from stats_calculator import calculate_stats
from llm_client import rewrite_message


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Message Rewriter API v3")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"status": "ok", "version": "3.0.0"}


@app.get("/metadata")
async def get_metadata():
    return {
        "channels": ["Teams", "Email"],
        "tones": ["Neutral", "Friendly", "Firm", "Diplomatic", "Direct", "Empathetic"],
        "role_modes": ["General", "Sales", "Support", "Engineering", "HR"],
        "templates": ["Quick question", "Follow up", "Status update", "Escalation", "Apology and fix"],
        "lengths": ["Short", "Normal"]
    }


@app.post("/rewrite")
async def rewrite(request: RewriteRequest) -> RewriteResponse:
    if len(request.text) > 1500:
        raise HTTPException(
            status_code=413,
            detail="Too long. Limit is 1500 characters."
        )
    
    risk_input = compute_risk(request.text)
    stats_before = calculate_stats(request.text)
    
    max_retries = 1
    retry_count = 0
    llm_result = None
    last_error = None
    
    while retry_count <= max_retries:
        try:
            llm_result = await rewrite_message(
                text=request.text,
                context=request.context or "",
                channel=request.channel,
                tone=request.tone,
                role_mode=request.role_mode,
                template=request.template,
                length=request.length,
                strict_mode=False
            )
            break
        except Exception as e:
            last_error = e
            retry_count += 1
            if retry_count <= max_retries:
                await asyncio.sleep(0.5)
    
    if llm_result is None:
        logger.error(f"LLM failed after {max_retries + 1} attempts: {last_error}")
        return JSONResponse(
            status_code=502,
            content={
                "error_code": "LLM_UPSTREAM_ERROR",
                "message": "Rewrite failed. Try again."
            }
        )
    
    risk_output = compute_risk(llm_result["rewritten_text"])
    stats_after = calculate_stats(llm_result["rewritten_text"])
    
    rewrite_id = str(uuid.uuid4())
    
    return RewriteResponse(
        rewrite_request_id=rewrite_id,
        rewritten_text=llm_result["rewritten_text"],
        what_changed=llm_result["what_changed"],
        clarifying_question=llm_result["clarifying_question"],
        confidence=llm_result["confidence"],
        risk_score_input=risk_input.score,
        risk_level_input=risk_input.level,
        risk_reasons_input=risk_input.reasons,
        risk_score_output=risk_output.score,
        risk_level_output=risk_output.level,
        risk_reasons_output=risk_output.reasons,
        detected_flags_input=list(risk_input.flags),
        detected_flags_output=list(risk_output.flags),
        stats_before=stats_before,
        stats_after=stats_after
    )


@app.post("/rewrite/safer")
async def rewrite_safer(request: RewriteRequest) -> RewriteResponse:
    if len(request.text) > 1500:
        raise HTTPException(
            status_code=413,
            detail="Too long. Limit is 1500 characters."
        )
    
    risk_input = compute_risk(request.text)
    stats_before = calculate_stats(request.text)
    
    max_retries = 1
    retry_count = 0
    llm_result = None
    last_error = None
    
    while retry_count <= max_retries:
        try:
            llm_result = await rewrite_message(
                text=request.text,
                context=request.context or "",
                channel=request.channel,
                tone=request.tone,
                role_mode=request.role_mode,
                template=request.template,
                length=request.length,
                strict_mode=True
            )
            break
        except Exception as e:
            last_error = e
            retry_count += 1
            if retry_count <= max_retries:
                await asyncio.sleep(0.5)
    
    if llm_result is None:
        logger.error(f"LLM failed after {max_retries + 1} attempts: {last_error}")
        return JSONResponse(
            status_code=502,
            content={
                "error_code": "LLM_UPSTREAM_ERROR",
                "message": "Rewrite failed. Try again."
            }
        )
    
    risk_output = compute_risk(llm_result["rewritten_text"])
    stats_after = calculate_stats(llm_result["rewritten_text"])
    
    rewrite_id = str(uuid.uuid4())
    
    return RewriteResponse(
        rewrite_request_id=rewrite_id,
        rewritten_text=llm_result["rewritten_text"],
        what_changed=llm_result["what_changed"],
        clarifying_question=llm_result["clarifying_question"],
        confidence=llm_result["confidence"],
        risk_score_input=risk_input.score,
        risk_level_input=risk_input.level,
        risk_reasons_input=risk_input.reasons,
        risk_score_output=risk_output.score,
        risk_level_output=risk_output.level,
        risk_reasons_output=risk_output.reasons,
        detected_flags_input=list(risk_input.flags),
        detected_flags_output=list(risk_output.flags),
        stats_before=stats_before,
        stats_after=stats_after
    )


@app.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    logger.info(f"Feedback received for rewrite_request_id={request.rewrite_request_id}, rating={request.rating}, tags={request.tags}")
    
    return {"status": "ok", "message": "Feedback recorded"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
