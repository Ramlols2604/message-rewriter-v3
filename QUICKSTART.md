# Quick Start Guide

Get the Message Rewriter MVP v3 running in 5 minutes.

## Step 1: Get Backboard API Key

1. Go to https://app.backboard.io
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

## Step 2: Setup Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` and add your API key:
```
BACKBOARD_API_KEY=your_actual_key_here
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

Backend is now running at http://localhost:8000

## Step 3: Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend is now running at http://localhost:3000 (or 3001 if 3000 is taken)

## Step 4: Test It

1. Open http://localhost:3000 in your browser
2. Type a casual message: "hey can u send me that report asap"
3. Select your preferences from the dropdowns
4. Click "Rewrite"
5. See the professional version with risk assessment

## Test Without Backboard API Key

You can test the risk scoring without an API key:

```bash
cd backend
source venv/bin/activate
python test_risk.py
```

This shows how the deterministic risk scoring works independently.

## Next Steps

- Add your Backboard API key to test the full rewrite flow
- Try different tones and templates
- Test the "Make Safer" button with risky content
- Submit feedback to see the flow
- Deploy to production (see DEPLOYMENT.md)

## Troubleshooting

**Backend won't start:**
- Make sure you're in the venv: `source venv/bin/activate`
- Check Python version: `python --version` (needs 3.9+)

**Frontend won't start:**
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Try a different port: `npm run dev -- -p 3001`

**"LLM_UPSTREAM_ERROR":**
- Check your Backboard API key is set correctly in `.env`
- Verify the key is valid at https://app.backboard.io

**CORS errors in browser:**
- Make sure backend `CORS_ORIGINS` includes your frontend URL
- Restart backend after changing .env
