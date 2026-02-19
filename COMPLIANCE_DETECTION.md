# Compliance Risk Detection - NEW FEATURE ✅

## Overview
Added detection for requests to communicate outside official channels, which is a major compliance risk in corporate environments.

## Risk Flag: BYPASS_OFFICIAL_CHANNELS
**Weight**: 35 points (Medium Risk)

## What It Detects

### Personal Communication Requests
- "email me personally"
- "send to my personal email"
- "contact me on my private email"
- "use my personal account"
- "call my cell"
- "text me personally"

### Off-Record Communication
- "off the record"
- "take this offline"
- "outside of work"
- "not through work"

### Unofficial Channels
- "DM me" / "direct message me"
- "side channel"
- "bypass" / "workaround"

## Why This Matters

### Compliance Risks
1. **Data Loss Prevention**: Company data leaves official systems
2. **Audit Trail**: No record of important business communications
3. **Legal Discovery**: Personal emails may not be preserved for litigation
4. **Security**: Personal accounts lack corporate security controls
5. **Policy Violation**: Bypasses company communication policies

### Corporate Policies
Most companies prohibit:
- Using personal email for business communications
- Conducting business on personal devices/accounts
- Taking confidential discussions "offline" without documentation

## Detection Examples

### Example 1: Personal Email Request
```
Input: "email me personally about the contract"
Risk Score: 35/100 (Medium)
Flag: BYPASS_OFFICIAL_CHANNELS
Reason: "Requests communication outside official channels"
```

### Example 2: Combined with PII
```
Input: "send it to my personal email john@gmail.com"
Risk Score: 75/100 (High)
Flags: BYPASS_OFFICIAL_CHANNELS (35) + PII_EMAIL (40)
Reasons:
  - "Contains email address"
  - "Requests communication outside official channels"
```

### Example 3: Off-Record Request
```
Input: "let's take this offline and discuss privately"
Risk Score: 35/100 (Medium)
Flag: BYPASS_OFFICIAL_CHANNELS
Reason: "Requests communication outside official channels"
```

### Example 4: Direct Message Request
```
Input: "DM me on Slack instead of using the channel"
Risk Score: 35/100 (Medium)
Flag: BYPASS_OFFICIAL_CHANNELS
Reason: "Requests communication outside official channels"
```

## Test Results

All compliance detection tests passing:

```
✅ "email me personally" → 35/100 (Medium)
✅ "send to my personal email" → 35/100 (Medium)
✅ "contact me on my private email" → 35/100 (Medium)
✅ "lets take this offline" → 35/100 (Medium)
✅ "DM me about this" → 35/100 (Medium)
✅ "use my personal account" → 35/100 (Medium)
```

## How Make Safer Handles This

When you click "Make Safer" on text with BYPASS_OFFICIAL_CHANNELS flag:

**Before**:
```
"Could you email me personally about the budget?"
```

**After (Safer)**:
```
"Could you send me the budget information?"
```

The LLM is instructed to:
1. Remove references to personal/private channels
2. Use neutral language (just "email" not "personal email")
3. Keep the request professional and on-record

## Integration with Other Flags

This flag can combine with others for higher risk:

| Combination | Total Score | Level | Scenario |
|-------------|-------------|-------|----------|
| BYPASS + PII_EMAIL | 75 | High | "email me at personal@gmail.com" |
| BYPASS + AGGRESSIVE | 45 | Medium | "DM me ASAP" |
| BYPASS + CONFIDENTIAL | 55 | Medium | "send NDA to my personal email" |
| BYPASS + PII_PHONE | 75 | High | "call my personal cell 555-1234" |

## Configuration

### Current Keywords (in risk_scoring.py)
```python
BYPASS_CHANNEL_KEYWORDS = [
    "personal email", "personally", "private email", "personal account",
    "off the record", "offline", "side channel", "direct message me",
    "dm me", "text me personally", "call my cell", "my personal",
    "outside of work", "not through work", "bypass", "workaround"
]
```

### To Add More Keywords
Edit `backend/risk_scoring.py` and add to the `BYPASS_CHANNEL_KEYWORDS` list.

## Production Recommendations

### For HR/Compliance Teams
1. Review flagged messages weekly
2. Use as training examples for policy education
3. Track repeat offenders for coaching
4. Consider higher weight (40-45) for stricter enforcement

### For IT/Security Teams
1. Monitor patterns of bypass attempts
2. Cross-reference with DLP alerts
3. Flag users trying multiple bypass methods
4. Consider blocking at email gateway level

### For Business Users
- The rewriter will automatically suggest official channel alternatives
- "Make Safer" button removes bypass language
- System educates users about policy compliance

## Testing

### Manual Test
1. Open http://localhost:3000
2. Input: `email me personally`
3. Click "Rewrite"
4. ✅ Should show Input Risk: 35/100 (Medium)
5. ✅ Reason: "Requests communication outside official channels"

### Automated Test
```bash
cd backend
source venv/bin/activate
python quick_test.py
```

Expected: 9/9 tests pass (including new compliance test)

## Summary

✅ **New Risk Flag**: BYPASS_OFFICIAL_CHANNELS (35 points)
✅ **Detection Keywords**: 14+ phrases covering personal email, offline, DM requests
✅ **Compliance Focus**: Prevents data loss and policy violations
✅ **Make Safer Integration**: Automatically removes bypass language
✅ **Fully Tested**: All detection scenarios verified

This addresses a critical gap in corporate communication compliance and helps users stay within company policies automatically.
