#!/bin/bash

echo "🚀 Deploying Eliza Agent to Railway..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your configuration."
    exit 1
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔐 Logging into Railway..."
railway login

# Initialize Railway project (if not already initialized)
if [ ! -f "railway.toml" ]; then
    echo "🚂 Initializing Railway project..."
    railway init
fi

# Set environment variables
echo "🔧 Setting environment variables..."
railway variables set OPENAI_API_KEY=$(grep OPENAI_API_KEY .env | cut -d '=' -f2)
railway variables set PGLITE_DATA_DIR=/app/.eliza/.elizadb
railway variables set PRIVATE_KEY=$(grep PRIVATE_KEY .env | cut -d '=' -f2)

# Deploy to Railway
echo "🌐 Deploying to Railway..."
railway up

if [ $? -eq 0 ]; then
    echo "✅ Deployed successfully to Railway!"
    
    # Get the deployment URL
    RAILWAY_URL=$(railway status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    
    echo "🌐 Eliza Agent URL: $RAILWAY_URL"
    echo ""
    echo "Next steps:"
    echo "1. Update your frontend to use: $RAILWAY_URL"
    echo "2. Deploy frontend to Vercel with the new API URL"
    echo ""
    echo "To view logs: railway logs"
    echo "To open dashboard: railway open"
else
    echo "❌ Railway deployment failed!"
    exit 1
fi
