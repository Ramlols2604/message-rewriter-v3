import json
import asyncio
from typing import Dict, Any, Optional
from backboard import BackboardClient
from config import settings


_client: Optional[BackboardClient] = None
_assistant_id: Optional[str] = None


def _extract_attr(obj: Any, key: str, default: Any = None) -> Any:
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)


def _extract_content(resp: Any) -> str:
    if isinstance(resp, str):
        return resp
    content = _extract_attr(resp, "content", "")
    if content:
        return content
    if isinstance(resp, dict):
        return str(resp)
    return ""


def _extract_json_block(text: str) -> Dict:
    raw = text.strip()
    if "```json" in raw:
        raw = raw.split("```json", 1)[1].split("```", 1)[0].strip()
    elif "```" in raw:
        raw = raw.split("```", 1)[1].split("```", 1)[0].strip()
    return json.loads(raw)


async def _get_client() -> BackboardClient:
    global _client
    if _client is None:
        _client = BackboardClient(api_key=settings.BACKBOARD_API_KEY)
    return _client


async def _get_or_create_assistant() -> str:
    global _assistant_id
    if _assistant_id:
        return _assistant_id

    client = await _get_client()
    assistant = await client.create_assistant(
        name="Message Rewriter",
        description="Professional message rewriter for workplace communication",
    )
    _assistant_id = _extract_attr(assistant, "assistant_id")
    if not _assistant_id:
        raise RuntimeError("Backboard assistant_id missing in SDK response")
    return _assistant_id


def build_prompt(
    text: str,
    context: str,
    channel: str,
    tone: str,
    role_mode: str,
    template: str,
    length: str,
    strict_mode: bool
) -> str:
    system_rules = """You rewrite the user's message into professional workplace text.

Hard rules:
- Preserve meaning.
- Do not add new facts.
- Do not change names, dates, numbers, amounts, or IDs.
- No emojis.
- Follow the selected channel, tone, role mode, template, and length.
- If meaning is ambiguous, ask exactly one clarifying question.
- Always produce a best-effort rewrite anyway, using the safest reasonable interpretation.
- Output must be valid JSON only, with the exact keys: rewritten_text, what_changed, clarifying_question, confidence

Formatting rules:
- Teams: 1 to 4 lines. No greeting. No signature. Bullets allowed.
- Email: Include greeting and sign off. Short paragraphs. Clear ask and next step.

Template rules:
- Quick question: one line context, one clear question.
- Follow up: reference prior ask, request status, propose next step.
- Status update: 2 to 5 bullets. Use Done, Next, Blocked when relevant.
- Escalation: issue, impact, what you need, deadline if present.
- Apology and fix: apology, what happened, what you are doing, next update time."""

    if strict_mode:
        system_rules += """

Strict mode rules (ACTIVE):
- Remove certainty language.
- Avoid implied commitments.
- Avoid guarantees.
- Prefer conservative wording."""

    user_message = f"""Inputs:
channel: {channel}
tone: {tone}
role_mode: {role_mode}
template: {template}
length: {length}
strict_mode: {strict_mode}

message: "{text}"
context: "{context}"

JSON rules:
- what_changed must be an array of 2 to 4 short strings.
- clarifying_question must be empty string or one question ending with a question mark.
- confidence must be "high" or "low".

Return ONLY valid JSON:
{{
  "rewritten_text": "string",
  "what_changed": ["string", "string"],
  "clarifying_question": "",
  "confidence": "high"
}}"""

    return system_rules + "\n\n" + user_message


async def rewrite_message(
    text: str,
    context: str,
    channel: str,
    tone: str,
    role_mode: str,
    template: str,
    length: str,
    strict_mode: bool = False
) -> Dict:
    try:
        client = await _get_client()
        assistant_id = await _get_or_create_assistant()
        
        thread = await asyncio.wait_for(
            client.create_thread(assistant_id),
            timeout=8.0
        )
        thread_id = _extract_attr(thread, "thread_id")
        if not thread_id:
            raise RuntimeError("Backboard thread_id missing in SDK response")

        prompt = build_prompt(text, context, channel, tone, role_mode, template, length, strict_mode)
        
        response = await asyncio.wait_for(
            client.add_message(
                thread_id=thread_id,
                content=prompt,
                llm_provider="openai",
                model_name="gpt-4o",
                stream=False,
                memory="off",
            ),
            timeout=8.0
        )

        result = _extract_json_block(_extract_content(response))
        
        result.setdefault("rewritten_text", text)
        result.setdefault("what_changed", ["Reformatted for clarity", "Adjusted tone"])
        result.setdefault("clarifying_question", "")
        result.setdefault("confidence", "high")
        
        if not isinstance(result["what_changed"], list) or len(result["what_changed"]) < 2:
            result["what_changed"] = ["Reformatted for clarity", "Adjusted tone"]
        
        if result["confidence"] not in ["high", "low"]:
            result["confidence"] = "high"
        
        return result

    except asyncio.TimeoutError:
        raise RuntimeError("LLM request timed out")
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Invalid JSON response from LLM: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"LLM error: {str(e)}")
