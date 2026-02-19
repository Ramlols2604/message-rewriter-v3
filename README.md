# ProDraft AI

**Clear. Professional. Compliant communication.**

Transform informal or unclear messages into polished, workplace-ready communication. ProDraft AI preserves intent, applies tone and formatting rules, and evaluates risk to help teams communicate clearly and responsibly.

## Features

### Core Capabilities
- **AI-Powered Rewriting**: Single LLM call for low-latency professional text transformation
- **Comprehensive Compliance Detection**: 11 risk categories covering corporate, legal, and regulatory risks
- **150+ Detection Keywords**: Enterprise-grade compliance monitoring  
- **Dual Risk Assessment**: See both input and output risk scores side-by-side
- **Make Safer Mode**: Extra conservative rewriting for high-risk content
- **Smart Statistics**: Character, sentence, and bullet point counting

### Compliance Categories
- **Channel Bypass Detection** (35 pts): Personal email, unofficial channels
- **Financial Disclosure** (40 pts): Revenue, earnings, MNPI
- **HIPAA/Medical Information** (45 pts): PHI, patient data
- **Customer Data Protection** (35 pts): GDPR, CCPA compliance
- **Insider Trading Prevention** (50 pts): Material non-public information
- **Legal/Litigation Discussion** (30 pts): Lawsuits, disputes
- **Credentials Exposure** (45 pts): Passwords, API keys
- **Discrimination Detection** (40 pts): Hiring bias, EEOC violations
- **Regulatory Violations** (35 pts): SEC, FDA, FTC
- **PII Detection** (40-50 pts): Email, phone, SSN, credit cards

### User Experience
- Support for Teams and Email formats
- Multiple tone, role, and template options
- Optional parameter controls with checkboxes
- Feedback system with star ratings and tags
- Industry-specific detection for Healthcare, Finance, Tech, HR, Legal
- "Make Safer" mode for high-risk content

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python 3.9+
- **LLM**: Backboard API (or OpenAI/Anthropic)
- **Database**: Supabase Postgres (optional, skip for MVP demo)

## Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your BACKBOARD_API_KEY
uvicorn main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local if needed (default points to localhost:8000)
npm run dev
```

Frontend runs at `http://localhost:3000`

## API Endpoints

- `GET /metadata` - Returns dropdown options
- `POST /rewrite` - Rewrites message with selected parameters
- `POST /rewrite/safer` - Rewrites with strict safety mode
- `POST /feedback` - Submits user feedback (persists to database)

## Environment Variables

### Backend (.env)
- `BACKBOARD_API_KEY` - Your Backboard API key
- `CORS_ORIGINS` - Comma-separated list of allowed origins

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Deployment

### Backend (Render/Fly.io)

**Render:**
1. Create new Web Service
2. Build: `pip install -r backend/requirements.txt`
3. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add env var: `BACKBOARD_API_KEY`

**Fly.io:**
```bash
cd backend
fly launch
fly secrets set BACKBOARD_API_KEY=xxx
fly deploy
```

### Frontend (Vercel)

1. Connect GitHub repo
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Add env var: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

## Risk Scoring

Deterministic flags with weights:
- PII (email, phone, SSN, credit card): 40-50 points
- Threats or violence: 30 points
- Harassment/hate: 30 points
- Sexual content: 30 points
- Confidential hints: 20 points
- Overpromising: 15 points
- Aggressive tone: 10 points

Risk levels:
- 0-29: Low
- 30-59: Medium
- 60-100: High

## License

MIT
