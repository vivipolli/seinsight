#!/bin/bash

echo "🚀 Complete Deploy: Eliza Agent (Railway) + Frontend (Vercel)"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your configuration."
    exit 1
fi

# Step 1: Deploy Eliza Agent to Railway
echo "📦 Step 1: Deploying Eliza Agent to Railway..."
./deploy-railway.sh

if [ $? -ne 0 ]; then
    echo "❌ Railway deployment failed!"
    exit 1
fi

# Get Railway URL (you'll need to manually set this after first deploy)
echo ""
echo "🔧 After Railway deployment, please:"
echo "1. Copy the Railway URL from the output above"
echo "2. Set it as environment variable in Vercel:"
echo "   vercel env add REACT_APP_ELIZA_API_URL"
echo ""

# Step 2: Deploy Frontend to Vercel
echo "📦 Step 2: Deploying Frontend to Vercel..."
./deploy-vercel.sh

if [ $? -eq 0 ]; then
    echo "✅ Complete deployment successful!"
    echo ""
    echo "🌐 Your app is now live!"
    echo "🔧 Eliza Agent: Railway"
    echo "📱 Frontend: Vercel"
    echo ""
    echo "Remember to set REACT_APP_ELIZA_API_URL in Vercel dashboard"
else
    echo "❌ Vercel deployment failed!"
    exit 1
fi
