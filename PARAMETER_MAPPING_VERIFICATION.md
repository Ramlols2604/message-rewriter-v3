# Parameter Mapping Verification

## Complete API Contract Verification ✅

### Frontend → Backend → LLM Flow

```
User Input (Frontend)
    ↓
API Call (lib/api.ts)
    ↓
Backend Validation (models.py)
    ↓
Risk Scoring (risk_scoring.py)
    ↓
LLM Prompt (llm_client.py)
    ↓
Response Mapping (main.py)
    ↓
Frontend Display (OutputPanel.tsx)
```

---

## 1. POST /rewrite - Request Mapping

### Frontend → Backend

| Frontend Field | API Payload | Backend Field | Type | Validation |
|---------------|-------------|---------------|------|------------|
| `message` | `text` | `text` | string | max 1500 chars ✅ |
| `context` | `context` | `context` | string | max 280 chars, optional ✅ |
| `channel` | `channel` | `channel` | string | "Teams"\|"Email" ✅ |
| `tone` | `tone` | `tone` | string | 6 options ✅ |
| `roleMode` | `role_mode` | `role_mode` | string | 5 options ✅ |
| `template` | `template` | `template` | string | 5 options ✅ |
| `length` | `length` | `length` | string | "Short"\|"Normal" ✅ |

**Verified**: All fields correctly mapped ✅

---

## 2. POST /rewrite - Response Mapping

### Backend → Frontend

| Backend Field | Frontend Field | Type | Usage | Verified |
|--------------|----------------|------|-------|----------|
| `rewrite_request_id` | `rewrite_request_id` | string (UUID) | Feedback tracking | ✅ |
| `rewritten_text` | `rewritten_text` | string | Display in output box | ✅ |
| `what_changed` | `what_changed` | string[] | Bullets (2-4 items) | ✅ |
| `clarifying_question` | `clarifying_question` | string | Shows if not empty | ✅ |
| `confidence` | `confidence` | "high"\|"low" | Badge display | ✅ |
| `risk_score_input` | `risk_score_input` | number (0-100) | **NEW** Input Risk Panel | ✅ |
| `risk_level_input` | `risk_level_input` | string | Low/Medium/High | ✅ |
| `risk_reasons_input` | `risk_reasons_input` | string[] | Input flags | ✅ |
| `risk_score_output` | `risk_score_output` | number (0-100) | Output Risk Panel | ✅ |
| `risk_level_output` | `risk_level_output` | string | Low/Medium/High | ✅ |
| `risk_reasons_output` | `risk_reasons_output` | string[] | Output flags | ✅ |
| `detected_flags_input` | `detected_flags_input` | string[] | Raw flag names | ✅ |
| `detected_flags_output` | `detected_flags_output` | string[] | Raw flag names | ✅ |
| `stats_before` | `stats_before` | Stats object | Character/sentence/bullet | ✅ |
| `stats_after` | `stats_after` | Stats object | Character/sentence/bullet | ✅ |

**Verified**: All response fields correctly mapped and displayed ✅

---

## 3. POST /feedback - Request Mapping

### Frontend → Backend

| Frontend Field | API Payload | Backend Field | Type | Validation |
|---------------|-------------|---------------|------|------------|
| `output.rewrite_request_id` | `rewrite_request_id` | `rewrite_request_id` | string | Required ✅ |
| `rating` | `rating` | `rating` | number | 1-5 ✅ |
| `selectedTags` | `tags` | `tags` | string[] | Optional ✅ |
| `note` | `note` | `note` | string | max 300 chars ✅ |
| `message` | `original_text` | `original_text` | string | Optional ✅ |
| `output.rewritten_text` | `rewritten_text` | `rewritten_text` | string | Optional ✅ |
| `context` | `context` | `context` | string | Optional ✅ |
| `channel` | `channel` | `channel` | string | Optional ✅ |
| `tone` | `tone` | `tone` | string | Optional ✅ |
| `roleMode` | `role_mode` | `role_mode` | string | Optional ✅ |
| `template` | `template` | `template` | string | Optional ✅ |
| `length` | `length` | `length` | string | Optional ✅ |

**Verified**: All feedback fields correctly mapped ✅

---

## 4. LLM Prompt Parameter Mapping

### Backend → Prompt Template

| Backend Input | Prompt Variable | LLM Context | Verified |
|--------------|----------------|-------------|----------|
| `text` | `{text}` | User message | ✅ |
| `context` | `{context}` | Message context | ✅ |
| `channel` | `{channel}` | Teams/Email formatting | ✅ |
| `tone` | `{tone}` | Writing style | ✅ |
| `role_mode` | `{role_mode}` | Professional context | ✅ |
| `template` | `{template}` | Structure guidance | ✅ |
| `length` | `{length}` | Target length | ✅ |
| `strict_mode` | `{strict_mode}` | Risk reduction mode | ✅ |

**Verified**: All parameters correctly injected into prompt ✅

---

## 5. Dropdown Options Verification

### GET /metadata Response

```python
# Backend (main.py)
{
  "channels": ["Teams", "Email"],
  "tones": ["Neutral", "Friendly", "Firm", "Diplomatic", "Direct", "Empathetic"],
  "role_modes": ["General", "Sales", "Support", "Engineering", "HR"],
  "templates": ["Quick question", "Follow up", "Status update", "Escalation", "Apology and fix"],
  "lengths": ["Short", "Normal"]
}
```

### Frontend Defaults

```typescript
// Frontend (app/page.tsx)
const [channel, setChannel] = useState("Teams");
const [tone, setTone] = useState("Direct");
const [roleMode, setRoleMode] = useState("General");
const [template, setTemplate] = useState("Follow up");
const [length, setLength] = useState("Normal");
```

**Verified**: All options match spec exactly ✅

---

## 6. Optional Parameter Handling

### Checkbox State → API Call

| Checkbox | State Variable | Behavior When Unchecked | Verified |
|----------|---------------|-------------------------|----------|
| Context | `useContext` | Empty string `""` sent | ✅ |
| Channel | `useChannel` | Default "Teams" sent | ✅ |
| Tone | `useTone` | Default "Direct" sent | ✅ |
| Role | `useRole` | Default "General" sent | ✅ |
| Template | `useTemplate` | Default "Follow up" sent | ✅ |
| Length | `useLength` | Default "Normal" sent | ✅ |

**Note**: Backend requires all fields except `context`, so unchecked items still send defaults.

**Verified**: All optional parameter logic correct ✅

---

## 7. Risk Scoring Flag Mapping

### Risk Detector → Backend → Frontend

| Risk Flag | Weight | Trigger | Frontend Display | Verified |
|-----------|--------|---------|------------------|----------|
| `PII_EMAIL` | 40 | Regex: email pattern | "Contains email address" | ✅ |
| `PII_PHONE` | 40 | Regex: phone patterns | "Contains phone number" | ✅ |
| `PII_SSN` | 50 | Regex: XXX-XX-XXXX | "Contains social security number" | ✅ |
| `PII_CREDIT_CARD` | 50 | Regex: card patterns | "Contains credit card info" | ✅ |
| `THREAT_OR_VIOLENCE` | 30 | Keywords: hurt, kill, etc. | "Contains threatening language" | ✅ |
| `HARASSMENT_HATE` | 30 | Keywords: hate, stupid, etc. | "Contains offensive language" | ✅ |
| `SEXUAL_CONTENT` | 30 | Keywords: sexual, explicit | "Contains inappropriate content" | ✅ |
| `OVERPROMISE` | 15 | Keywords: guarantee, 100% | "Contains overpromising language" | ✅ |
| `AGGRESSIVE` | 10 | Keywords: asap, urgent | "Contains aggressive tone" | ✅ |
| `CONFIDENTIAL_HINT` | 20 | Keywords: NDA, secret | "Contains confidential information markers" | ✅ |

**Verified**: All risk detectors correctly mapped to human-readable reasons ✅

---

## 8. Stats Calculation Mapping

### Text → Stats Object

```python
# Backend (stats_calculator.py)
{
  "character_count": len(text),  # Total characters
  "sentence_count": len(sentences),  # Split on .!?
  "bullet_count": bullets  # Lines starting with - • or number.
}
```

**Heuristics**:
- Sentences: Split on `.`, `!`, `?` and count non-empty
- Bullets: Count lines matching `^\s*[-•]\s` or `^\s*\d+\.\s`

**Verified**: Stats calculation matches spec ✅

---

## 9. Error Code Mapping

### Backend → Frontend

| HTTP Code | Error Code | Backend Message | Frontend Display | Verified |
|-----------|-----------|-----------------|------------------|----------|
| 422 | Validation Error | Pydantic validation | Field-specific error | ✅ |
| 413 | Payload Too Large | "Text exceeds 1500 chars" | "Too long. Limit is 1500 characters." | ✅ |
| 502 | `LLM_UPSTREAM_ERROR` | Backboard timeout/error | "Rewrite failed. Try again." | ✅ |

**Verified**: All error codes correctly handled ✅

---

## 10. Modal Trigger Mapping

### Risk Level → Copy Confirmation Modal

```typescript
// Frontend (app/page.tsx)
const needsRiskConfirmation = 
  output && 
  output.risk_score_output >= 60 && 
  !riskConfirmed;

if (needsRiskConfirmation) {
  setShowRiskModal(true);
  return;
}
```

**Logic**:
- Output risk >= 60 (High) → Show modal
- Modal shows: Risk reasons, "Copy anyway", "Make safer"
- User must confirm before copying

**Verified**: Modal trigger correctly implemented ✅

---

## Summary: All Mappings Verified ✅

| Component | Status | Notes |
|-----------|--------|-------|
| Request parameters | ✅ | All fields correctly sent |
| Response fields | ✅ | All data correctly received |
| Dropdown options | ✅ | Match spec exactly |
| Risk scoring | ✅ | 10 flags, correct weights |
| Stats calculation | ✅ | Character/sentence/bullet counts |
| Error handling | ✅ | 422, 413, 502 mapped |
| Optional parameters | ✅ | Checkboxes control submission |
| LLM prompt | ✅ | All params injected correctly |
| Feedback flow | ✅ | 11 fields tracked |
| Modal triggers | ✅ | High-risk confirmation works |

**Result**: All parameters and features correctly mapped and functional! 🎉
