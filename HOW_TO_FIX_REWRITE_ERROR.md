# How to Fix "Rewrite failed. Try again." Error

## The Problem

You're seeing this error because the backend needs a Backboard API key to call the LLM for rewriting.

The error in the backend logs shows:
```
ERROR:main:LLM failed after 2 attempts: LLM error: Request failed: 403 Forbidden
```

This means the Backboard API key is either:
1. Missing (empty string)
2. Invalid/expired
3. Not set in the environment

## The Solution

### Option 1: Add Backboard API Key (Recommended for Full Functionality)

1. **Get your free API key**:
   - Go to https://app.backboard.io
   - Sign up (free tier available)
   - Navigate to your API keys
   - Copy your key

2. **Add it to your backend**:
   ```bash
   cd message-rewriter-v3/backend
   nano .env  # or use any text editor
   ```

3. **Update the file** to have your actual key:
   ```
   BACKBOARD_API_KEY=your_actual_key_here
   CORS_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

4. **Restart the backend**:
   - Find the terminal where backend is running
   - Press `Ctrl+C` to stop it
   - Start again:
   ```bash
   source venv/bin/activate
   uvicorn main:app --reload --port 8000
   ```

5. **Refresh your browser** at http://localhost:3001 and try again!

### Option 2: Use OpenAI Instead

If you prefer OpenAI, you can swap it in:

1. Edit `backend/llm_client.py`
2. Replace Backboard code with OpenAI SDK
3. Use `OPENAI_API_KEY` instead

### Option 3: Test Without LLM (UI Only)

The risk scoring works without any API key:

```bash
cd backend
source venv/bin/activate
python test_risk.py
```

This shows how messages are scored for risk without calling any LLM.

## What's Working Right Now

Even without the API key:
- ✅ UI is fully functional
- ✅ All form fields and checkboxes work
- ✅ Risk scoring (deterministic) works
- ✅ Copy and feedback features work
- ❌ LLM rewriting doesn't work (needs API key)

## Quick Test

Try this message to see risk scoring work (backend terminal):
```bash
cd backend
source venv/bin/activate
python test_risk.py
```

You'll see messages scored for PII, aggressive language, etc.
