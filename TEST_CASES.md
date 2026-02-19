# Comprehensive Test Cases - Message Rewriter v3

## Test Setup
1. Open http://localhost:3000 in browser
2. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. Open DevTools Console (F12) to monitor errors

---

## Category 1: Risk Detection Tests

### Test 1.1: Low Risk - Aggressive Tone
**Input**:
```
hey can u send me that report asap
```

**Settings**: Keep defaults (Teams, Direct, General, Follow up, Normal)

**Expected Output**:
- ✅ Input Risk: 10/100 (Low)
- ✅ Input Reason: "Contains aggressive tone"
- ✅ Output Risk: 0/100 (Low)
- ✅ Rewritten text: Professional version without "asap"
- ✅ What changed: 2-4 bullets explaining improvements

---

### Test 1.2: Medium Risk - Email PII
**Input**:
```
Contact me at john.doe@example.com if you have questions
```

**Expected Output**:
- ✅ Input Risk: 40/100 (Medium)
- ✅ Input Reason: "Contains email address"
- ✅ Output Risk: 0 or 40 (depends if LLM keeps email)
- ✅ If output still has email, risk should show Medium

---

### Test 1.3: Medium Risk - Phone PII
**Input**:
```
Please call me at 555-123-4567 to discuss
```

**Expected Output**:
- ✅ Input Risk: 40/100 (Medium)
- ✅ Input Reason: "Contains phone number"
- ✅ Output Risk: Check if phone is removed or kept

---

### Test 1.4: High Risk - Email + Phone
**Input**:
```
Reach out to me at jane@company.com or call 555-987-6543
```

**Expected Output**:
- ✅ Input Risk: 80/100 (High)
- ✅ Input Reasons: "Contains email address", "Contains phone number"
- ✅ Output Risk: Depends on LLM behavior
- ✅ If Output Risk >= 60, Copy button should trigger confirmation modal

---

### Test 1.5: Multiple Risk Flags
**Input**:
```
I guarantee 100% we'll fix this asap, contact me at john@test.com
```

**Expected Output**:
- ✅ Input Risk: 65/100 (High)
- ✅ Flags: OVERPROMISE (15) + AGGRESSIVE (10) + PII_EMAIL (40)
- ✅ Top 3 reasons shown (sorted by weight)

---

### Test 1.6: Confidential Content
**Input**:
```
This is NDA information, do not share with anyone outside
```

**Expected Output**:
- ✅ Input Risk: 20/100 (Low)
- ✅ Input Reason: "Contains confidential information markers"

---

### Test 1.7: Clean Text - No Risk
**Input**:
```
Could you please send me the quarterly report when you get a chance? Thank you!
```

**Expected Output**:
- ✅ Input Risk: 0/100 (Low)
- ✅ Input Reasons: Empty or "No issues detected"
- ✅ Output Risk: 0/100 (Low)

---

## Category 2: Rewrite Functionality Tests

### Test 2.1: Teams Channel - Short Format
**Input**:
```
need the budget numbers for q4
```

**Settings**:
- Channel: Teams
- Tone: Direct
- Length: Short

**Expected Output**:
- ✅ No greeting (Teams format)
- ✅ 1-4 lines max
- ✅ Clear and direct
- ✅ What changed: Shows improvements

---

### Test 2.2: Email Channel - Full Format
**Input**:
```
need the budget numbers for q4
```

**Settings**:
- Channel: Email
- Tone: Friendly
- Length: Normal

**Expected Output**:
- ✅ Has greeting (e.g., "Hi," or "Hello,")
- ✅ Has sign-off (e.g., "Best regards,")
- ✅ Proper email structure
- ✅ Friendly tone

---

### Test 2.3: Different Tones
**Base Input**: `can u review my code`

**Test 5 different tones**:

| Tone | Expected Style |
|------|---------------|
| Neutral | "Could you review my code?" |
| Friendly | "Would you mind reviewing my code?" |
| Firm | "Please review my code." |
| Diplomatic | "I would appreciate if you could review my code" |
| Direct | "Please review my code." |
| Empathetic | "When you have a moment, could you review my code?" |

---

### Test 2.4: Templates

**Test Input**: `project is behind schedule`

| Template | Expected Structure |
|----------|-------------------|
| Quick question | Brief, one clear question |
| Follow up | References prior context, asks for update |
| Status update | Bullets: Done, Next, Blocked |
| Escalation | Issue, impact, what you need, deadline |
| Apology and fix | Apology, what happened, fix, next update |

---

### Test 2.5: Role Modes

**Test Input**: `customer wants refund`

| Role Mode | Expected Approach |
|-----------|------------------|
| General | Standard professional |
| Sales | Customer-focused, positive |
| Support | Helpful, solution-oriented |
| Engineering | Technical, clear problem statement |
| HR | Sensitive, policy-aware |

---

## Category 3: Make Safer Feature

### Test 3.1: Make Safer - Overpromise
**Input**:
```
I guarantee this will be 100% fixed by tomorrow
```

**Steps**:
1. Click "Rewrite"
2. Note the output and risk score
3. Click "Make Safer"
4. Compare results

**Expected Output**:
- ✅ "Before vs After" panel appears
- ✅ New text removes "guarantee", "100%"
- ✅ Uses phrases like "I will work to..." or "I expect..."
- ✅ Output risk score decreases
- ✅ What changed bullets explain safety improvements

---

### Test 3.2: Make Safer - Multiple Issues
**Input**:
```
I promise we'll definitely fix this ASAP 100% guaranteed
```

**Steps**:
1. Rewrite (normal mode)
2. Make Safer (strict mode)
3. Compare both outputs

**Expected**:
- ✅ Normal: May keep some certainty language
- ✅ Safer: Removes all promises, guarantees, 100%
- ✅ Risk score improvement visible in Before/After panel

---

## Category 4: User Interface Tests

### Test 4.1: Star Rating - Cumulative Display
**Steps**:
1. Scroll to Feedback section
2. Click on star #1 → ✅ Only star 1 is black
3. Click on star #3 → ✅ Stars 1, 2, 3 are all black
4. Click on star #5 → ✅ All 5 stars are black
5. Click on star #2 → ✅ Only stars 1, 2 are black

**If not working**: Hard refresh browser (Cmd+Shift+R)

---

### Test 4.2: Feedback Tags - Multiple Selection
**Steps**:
1. Click "Changed meaning" → ✅ Tag becomes black with white text
2. Click "Too formal" → ✅ Both tags are selected
3. Click "Good" → ✅ Three tags selected
4. Click "Changed meaning" again → ✅ Tag deselected

---

### Test 4.3: Optional Parameters - Checkboxes
**Steps**:
1. Uncheck "Tone" checkbox
   - ✅ Tone dropdown becomes faded (30% opacity)
   - ✅ Cannot interact with dropdown
2. Click "Rewrite"
   - ✅ Rewrite works (backend uses default)
3. Check "Tone" checkbox again
   - ✅ Dropdown becomes active
   - ✅ Can select different tone

**Test all checkboxes**: Context, Channel, Tone, Role, Template, Length

---

### Test 4.4: Copy Button - No Errors
**Steps**:
1. Rewrite any message
2. Click "Copy" button
3. ✅ Alert: "Copied to clipboard!"
4. ✅ No error in console (F12 → Console tab)
5. Paste in another app (e.g., Notes)
6. ✅ Text is correctly copied

---

### Test 4.5: Feedback Submission - Complete Flow
**Steps**:
1. Rewrite any message
2. Click 4 stars → ✅ Stars 1-4 are black
3. Select tags: "Good", "Too formal"
4. Add note: "Great output but slightly too formal"
5. Click "Submit Feedback"
6. ✅ Alert: "Feedback submitted successfully!"
7. ✅ Form resets (rating back to 0, tags cleared, note empty)
8. ✅ No console errors

---

### Test 4.6: Feedback Validation - Rating Required
**Steps**:
1. Rewrite any message
2. Don't click any stars (rating = 0)
3. Click "Submit Feedback"
4. ✅ Alert: "Please select a rating before submitting."
5. ✅ No API call made (check Network tab)

---

### Test 4.7: High-Risk Copy Modal
**Input**:
```
Contact me at john@example.com or 555-123-4567 ASAP
```

**Steps**:
1. Click "Rewrite"
2. If output keeps PII, risk should be High (>= 60)
3. Click "Copy" button
4. ✅ Modal appears with:
   - Title: "High Risk Content"
   - Message: "This text may be risky because:"
   - Risk reasons listed
   - Two buttons: "Copy anyway", "Make safer"
5. Click "Make safer"
   - ✅ Modal closes
   - ✅ Triggers safer rewrite
6. Alternatively, click "Copy anyway"
   - ✅ Modal closes
   - ✅ Text copied to clipboard

---

## Category 5: Edge Cases & Error Handling

### Test 5.1: Character Limit - Validation
**Input**: Paste 1600 characters (exceeds 1500 limit)

**Expected**:
- ✅ Error alert: "Too long. Limit is 1500 characters."
- ✅ HTTP 413 response
- ✅ User prompted to shorten

---

### Test 5.2: Empty Input - Validation
**Input**: Leave message box empty

**Expected**:
- ✅ Rewrite button disabled OR
- ✅ Error: "Message is required"

---

### Test 5.3: Context Character Limit
**Context**: Paste 300 characters (exceeds 280 limit)

**Expected**:
- ✅ Error message about context length
- ✅ HTTP 422 validation error

---

### Test 5.4: Special Characters
**Input**:
```
Can we discuss the Q3 results? Revenue increased 25% ($2.5M → $3.1M)
```

**Expected**:
- ✅ Special chars preserved: $, %, →
- ✅ Numbers preserved: 25, 2.5M, 3.1M
- ✅ What changed: Doesn't claim numbers were changed

---

### Test 5.5: Line Breaks and Bullets
**Input**:
```
Here are my concerns:
- Budget is over
- Timeline slipped
- Need more resources
```

**Expected**:
- ✅ Bullet count: 3
- ✅ Sentence count: Counted correctly
- ✅ Output may reformat but preserves structure

---

### Test 5.6: Emoji Input (Should Remove)
**Input**:
```
Hey! 😊 Can you send the report ASAP? 🚀
```

**Expected**:
- ✅ Output has NO emojis
- ✅ What changed: "Removed emojis"

---

### Test 5.7: All Caps Input
**Input**:
```
URGENT: NEED THE BUDGET NUMBERS NOW
```

**Expected**:
- ✅ Input Risk: High (AGGRESSIVE flag)
- ✅ Output: Normal casing, professional tone
- ✅ What changed: "Adjusted tone", "Fixed capitalization"

---

### Test 5.8: LLM Error Handling
**Simulate**: Backend down or API key invalid

**Steps**:
1. Stop backend (Ctrl+C in terminal)
2. Try to rewrite
3. ✅ Error message: "Rewrite failed. Try again."
4. ✅ No crash, can retry after backend restarts

---

## Category 6: Statistics Verification

### Test 6.1: Character Count
**Input**: `Hey, can you send me the report?` (32 chars)

**Expected**:
- ✅ Stats Before: character_count = 32
- ✅ Stats After: Likely higher (professional version longer)

---

### Test 6.2: Sentence Count
**Input**:
```
I need the report. Can you send it? Thanks!
```
(3 sentences)

**Expected**:
- ✅ Stats Before: sentence_count = 3
- ✅ Split on `.`, `!`, `?`

---

### Test 6.3: Bullet Count
**Input**:
```
Action items:
- Review budget
- Update timeline
- Schedule meeting
```
(3 bullets)

**Expected**:
- ✅ Stats Before: bullet_count = 3
- ✅ Detects lines starting with `-`, `•`, or `1.`

---

## Category 7: Integration Tests

### Test 7.1: Complete Flow - Low Risk
**Scenario**: Quick question to manager

**Steps**:
1. Input: `can u send me the q4 numbers`
2. Context: `Asking my manager for quarterly data`
3. Channel: Teams
4. Tone: Direct
5. Click "Rewrite"
6. ✅ Verify professional output
7. ✅ Input Risk: 0/100
8. ✅ Output Risk: 0/100
9. Click "Copy"
10. ✅ Copied successfully
11. Rate 5 stars, tag "Good"
12. Click "Submit Feedback"
13. ✅ Success

---

### Test 7.2: Complete Flow - High Risk → Make Safer
**Scenario**: Email with PII needs cleaning

**Steps**:
1. Input: `Reach me at john@test.com or 555-123-4567 ASAP`
2. Channel: Email
3. Tone: Diplomatic
4. Click "Rewrite"
5. ✅ Input Risk: 90/100 (Email + Phone + Aggressive)
6. ✅ Output may still have PII
7. Click "Make Safer"
8. ✅ New output removes/obscures PII
9. ✅ Risk score drops
10. ✅ Before/After panel shows improvement
11. Click "Copy"
12. If still high risk, modal appears
13. Click "Copy anyway"
14. ✅ Copied successfully

---

### Test 7.3: Complete Flow - Clarifying Question
**Scenario**: Ambiguous request

**Input**:
```
Can we discuss the thing from yesterday?
```

**Expected**:
- ✅ Clarifying question appears: "What specific topic from yesterday would you like to discuss?"
- ✅ Rewrite still provided (best-effort assumption)
- ✅ User can add to context and rewrite again

---

## Test Results Checklist

### Critical Features (Must Pass)
- [ ] Risk detection works (input + output shown)
- [ ] Star rating shows cumulative selection (1-5)
- [ ] Copy button works without errors
- [ ] Feedback submission works (rating 1-5)
- [ ] Make Safer produces different output
- [ ] High-risk modal triggers when risk >= 60
- [ ] All dropdowns populated correctly
- [ ] Optional parameter checkboxes work

### Important Features (Should Pass)
- [ ] Different tones produce different styles
- [ ] Templates follow specified structures
- [ ] Email format includes greeting/sign-off
- [ ] Teams format is concise (1-4 lines)
- [ ] Statistics calculated correctly
- [ ] Character limit enforced (1500)
- [ ] What changed bullets are relevant

### Nice to Have (May Vary)
- [ ] Clarifying questions asked when needed
- [ ] Confidence level matches quality
- [ ] LLM removes emojis
- [ ] Special characters preserved
- [ ] Numbers/dates unchanged

---

## Quick Smoke Test (5 minutes)

Run these 5 tests to verify core functionality:

1. **Basic Rewrite**: `can u send the report` → Should rewrite professionally ✅
2. **Risk Detection**: `contact me at test@email.com` → Should show 40/100 risk ✅
3. **Star Rating**: Click star 3 → Stars 1, 2, 3 black ✅
4. **Copy**: Click Copy → No errors, text copied ✅
5. **Feedback**: Rate 4 stars + submit → Success alert ✅

If all 5 pass, the app is working! 🎉

---

## Reporting Issues

When reporting bugs, include:
1. **Test case number** (e.g., Test 1.2)
2. **Input text** used
3. **Settings** (channel, tone, etc.)
4. **Expected result** vs **Actual result**
5. **Screenshots** of console errors (if any)
6. **Browser** and version

Example:
```
Test 4.1 failed - Star rating not cumulative
- Clicked star 3
- Expected: Stars 1, 2, 3 black
- Actual: Only star 3 is black
- Browser: Chrome 120
- Console: No errors
- Already tried: Hard refresh (Cmd+Shift+R)
```
