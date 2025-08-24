#!/bin/bash

echo "🚀 Deploying Seinsight AI to Vercel..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your configuration."
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployed successfully to Vercel!"
    echo "🌐 Your app is now live!"
    echo ""
    echo "To view logs: vercel logs"
    echo "To remove: vercel remove"
else
    echo "❌ Vercel deployment failed!"
    exit 1
fi
