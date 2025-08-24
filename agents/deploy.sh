#!/bin/bash

echo "🚀 Deploying Seinsight AI Agent..."

# Check if .env file exists
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

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Deploying with Docker..."
    
    # Build and run with docker-compose
    docker-compose up --build -d
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployed successfully with Docker!"
        echo "🌐 Frontend: http://localhost:3000"
        echo "🔧 API: http://localhost:3000/api"
        echo ""
        echo "To view logs: docker-compose logs -f"
        echo "To stop: docker-compose down"
    else
        echo "❌ Docker deployment failed!"
        exit 1
    fi
else
    echo "📡 Deploying with Node.js..."
    
    # Start the server directly
    node deploy.js
fi
