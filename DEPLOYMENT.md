# Deployment Guide

## Prerequisites

1. Backend API key from Backboard: https://app.backboard.io
2. Render account (for backend) or Fly.io account
3. Vercel account (for frontend)
4. GitHub repository (optional but recommended)

## Backend Deployment

### Option A: Render

1. Go to https://render.com and create a new Web Service
2. Connect your GitHub repository (or use manual deploy)
3. Configure service:
   - **Name**: `message-rewriter-api`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   - `BACKBOARD_API_KEY`: Your Backboard API key
   - `CORS_ORIGINS`: Your frontend URL (e.g., `https://message-rewriter.vercel.app`)
5. Click "Create Web Service"
6. Copy the deployed URL (e.g., `https://message-rewriter-api.onrender.com`)

### Option B: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Navigate to backend directory:
   ```bash
   cd backend
   ```
4. Launch app:
   ```bash
   fly launch --name message-rewriter-api --region iad --no-deploy
   ```
5. Set secrets:
   ```bash
   fly secrets set BACKBOARD_API_KEY=your_key_here
   fly secrets set CORS_ORIGINS=https://your-frontend.vercel.app
   ```
6. Deploy:
   ```bash
   fly deploy
   ```
7. Get URL: `fly status` (e.g., `https://message-rewriter-api.fly.dev`)

## Frontend Deployment

### Vercel

1. Go to https://vercel.com and click "New Project"
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL from Render/Fly.io
5. Click "Deploy"
6. Once deployed, copy the frontend URL (e.g., `https://message-rewriter.vercel.app`)
7. Go back to your backend deployment and update `CORS_ORIGINS` with the actual Vercel URL

## Post-Deployment Steps

1. Update backend `CORS_ORIGINS` environment variable with actual Vercel URL
2. Redeploy backend if needed
3. Test the live application:
   - Visit your Vercel URL
   - Try a simple rewrite
   - Verify risk scoring works
   - Test "Make Safer" button
   - Submit feedback

## Monitoring

- **Render**: Check logs at `https://dashboard.render.com/web/your-service-id`
- **Fly.io**: Run `fly logs` in the backend directory
- **Vercel**: Check logs at `https://vercel.com/dashboard`

## Troubleshooting

### Backend not starting
- Check environment variables are set correctly
- Verify `BACKBOARD_API_KEY` is valid
- Check logs for Python errors

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings in backend
- Open browser console for network errors

### LLM errors
- Verify Backboard API key is valid
- Check Backboard usage limits: https://app.backboard.io/usage
- Check backend logs for detailed error messages

## Costs

- **Render**: Free tier available (sleeps after inactivity)
- **Fly.io**: Free tier with resource limits
- **Vercel**: Free tier for personal projects
- **Backboard**: Free tier with credit limits
- **Total**: $0-$5/month for MVP usage
