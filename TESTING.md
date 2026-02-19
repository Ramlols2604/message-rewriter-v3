# Testing Guide

## Local Testing

Both servers are running:
- Backend: http://localhost:8000
- Frontend: http://localhost:3001

## Manual Test Cases

### Test 1: Basic Rewrite (Low Risk)
**Input**: "hey can u send me that report?"
**Expected**:
- Risk score: 0-10 (Low)
- Rewritten text should be professional
- No risk flags detected

### Test 2: PII Detection (High Risk)
**Input**: "Contact me at john@example.com or call 555-123-4567"
**Expected**:
- Risk score: 80 (High) - Email (40) + Phone (40)
- Flags: PII_EMAIL, PII_PHONE
- Reasons: "Contains email address", "Contains phone number"
- Copy button should show confirmation modal

### Test 3: Overpromising (Low-Medium Risk)
**Input**: "I guarantee this will be 100% risk free!"
**Expected**:
- Risk score: 15 (Low)
- Flag: OVERPROMISE
- Reason: "Contains overpromising language"

### Test 4: Aggressive Tone (Low Risk)
**Input**: "Fix this ASAP! This is unacceptable!"
**Expected**:
- Risk score: 10 (Low)
- Flag: AGGRESSIVE
- Reason: "Contains aggressive tone"

### Test 5: Confidential Content (Low Risk)
**Input**: "This is confidential NDA information, do not share"
**Expected**:
- Risk score: 20 (Low)
- Flag: CONFIDENTIAL_HINT
- Reason: "Contains confidential information markers"

### Test 6: Multiple Flags (High Risk)
**Input**: "I guarantee we'll fix this ASAP! Contact me at test@example.com"
**Expected**:
- Risk score: 55 (Medium) - Email (40) + Overpromise (15)
- Top reasons should show highest weighted flags first

### Test 7: Character Limit
**Input**: Text with 1501 characters
**Expected**:
- HTTP 413 error
- Message: "Too long. Limit is 1500 characters."

### Test 8: Make Safer Flow
1. Enter a risky message
2. Click "Rewrite"
3. Note the risk score
4. Click "Make Safer"
5. **Expected**: 
   - New rewrite with lower risk score
   - "Before vs After" panel shows improvement
   - Character count comparison

### Test 9: Copy Flow (Low/Medium Risk)
1. Enter and rewrite a safe message
2. Click "Copy"
3. **Expected**:
   - Text copied to clipboard immediately
   - Alert confirms copy
   - Feedback sent to backend

### Test 10: Copy Flow (High Risk)
1. Enter message with email and phone
2. Click "Rewrite"
3. Click "Copy"
4. **Expected**:
   - Confirmation modal appears
   - Shows risk reasons
   - Options: "Copy anyway" or "Make safer"

### Test 11: Feedback Submission
1. Rewrite a message
2. Rate with 4 stars
3. Select tags: "Good", "Too formal"
4. Add note: "Great but slightly stiff"
5. Click "Submit Feedback"
6. **Expected**:
   - Success alert
   - Feedback sent to backend with all data

### Test 12: Clarifying Question
**Note**: This requires LLM to be working (Backboard API key needed)
**Input**: Ambiguous message
**Expected**:
- Rewrite still provided
- Clarifying question displayed
- Instructions to add to Context field

## API Testing with curl

### Test metadata endpoint
```bash
curl http://localhost:8000/metadata
```

### Test rewrite endpoint
```bash
curl -X POST http://localhost:8000/rewrite \
  -H "Content-Type: application/json" \
  -d '{
    "text": "hey can u send me that report asap",
    "context": "To my manager",
    "channel": "Email",
    "tone": "Neutral",
    "role_mode": "General",
    "template": "Quick question",
    "length": "Short"
  }'
```

### Test safer rewrite
```bash
curl -X POST http://localhost:8000/rewrite/safer \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I guarantee this will work 100%",
    "context": "",
    "channel": "Teams",
    "tone": "Neutral",
    "role_mode": "General",
    "template": "Status update",
    "length": "Normal"
  }'
```

### Test feedback endpoint
```bash
curl -X POST http://localhost:8000/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "rewrite_request_id": "test-uuid-123",
    "rating": 5,
    "tags": ["Good"],
    "note": "Perfect!"
  }'
```

## Risk Scoring Verification

Run the test script:
```bash
cd backend
source venv/bin/activate
python test_risk.py
```

Expected output shows correct flag detection and scoring for each test case.

## Known Limitations (MVP)

- LLM calls require valid Backboard API key (get from https://app.backboard.io)
- No database persistence yet (feedback is logged, not stored)
- No rate limiting
- No user authentication
- No history panel
