#!/bin/bash

# Seinsight AI Workflow Test Script
# This script runs all tests for the complete workflow without making real API calls

echo "🚀 Starting Seinsight AI Workflow Tests..."
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the insights-analyzer directory"
    exit 1
fi

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Error: Bun is not installed. Please install Bun first."
    exit 1
fi

echo "📋 Running configuration tests..."
echo "--------------------------------"

# Test 1: Agent Configuration
echo "✅ Testing agent configurations..."
bun test src/__tests__/seinsight-workflow.test.ts --grep "Agent Configuration" --timeout 10000

if [ $? -eq 0 ]; then
    echo "✅ Agent configuration tests passed"
else
    echo "❌ Agent configuration tests failed"
    exit 1
fi

echo ""
echo "🔧 Running action tests..."
echo "-------------------------"

# Test 2: Action Configuration
echo "✅ Testing action configurations..."
bun test src/__tests__/seinsight-workflow.test.ts --grep "Action Configuration" --timeout 10000

if [ $? -eq 0 ]; then
    echo "✅ Action configuration tests passed"
else
    echo "❌ Action configuration tests failed"
    exit 1
fi

echo ""
echo "🎯 Running hashtag generation tests..."
echo "-------------------------------------"

# Test 3: Hashtag Generation
echo "✅ Testing hashtag generation..."
bun test src/__tests__/endpoint-workflow.test.ts --grep "Endpoint Input Processing" --timeout 15000

if [ $? -eq 0 ]; then
    echo "✅ Hashtag generation tests passed"
else
    echo "❌ Hashtag generation tests failed"
    exit 1
fi

echo ""
echo "📸 Running Instagram tests..."
echo "----------------------------"

# Test 4: Instagram Data Collection
echo "✅ Testing Instagram data collection..."
bun test src/__tests__/seinsight-workflow.test.ts --grep "Instagram Data Collection" --timeout 15000

if [ $? -eq 0 ]; then
    echo "✅ Instagram tests passed"
else
    echo "❌ Instagram tests failed"
    exit 1
fi

echo ""
echo "🐦 Running Twitter tests (MVP Mode)..."
echo "--------------------------------------"

# Test 5: Twitter Data Collection (MVP Mode)
echo "✅ Testing Twitter data collection in MVP mode..."
bun test src/__tests__/seinsight-workflow.test.ts --grep "Twitter Data Collection" --timeout 15000

if [ $? -eq 0 ]; then
    echo "✅ Twitter tests passed"
else
    echo "❌ Twitter tests failed"
    exit 1
fi

echo ""
echo "📊 Running insight compilation tests..."
echo "--------------------------------------"

# Test 6: Insight Compilation
echo "✅ Testing insight compilation..."
bun test src/__tests__/seinsight-workflow.test.ts --grep "Insight Compilation" --timeout 15000

if [ $? -eq 0 ]; then
    echo "✅ Insight compilation tests passed"
else
    echo "❌ Insight compilation tests failed"
    exit 1
fi

echo ""
echo "🔄 Running complete workflow integration tests..."
echo "------------------------------------------------"

# Test 7: Complete Workflow Integration
echo "✅ Testing complete workflow integration..."
bun test src/__tests__/seinsight-workflow.test.ts --grep "Complete Workflow Integration" --timeout 20000

if [ $? -eq 0 ]; then
    echo "✅ Complete workflow integration tests passed"
else
    echo "❌ Complete workflow integration tests failed"
    exit 1
fi

echo ""
echo "⚠️  Running error handling tests..."
echo "----------------------------------"

# Test 8: Error Handling
echo "✅ Testing error handling..."
bun test src/__tests__/seinsight-workflow.test.ts --grep "Error Handling" --timeout 10000

if [ $? -eq 0 ]; then
    echo "✅ Error handling tests passed"
else
    echo "❌ Error handling tests failed"
    exit 1
fi

echo ""
echo "🎉 All tests completed successfully!"
echo "===================================="
echo ""
echo "📋 Test Summary:"
echo "✅ Agent configurations"
echo "✅ Action configurations"
echo "✅ Hashtag generation"
echo "✅ Instagram data collection"
echo "✅ Twitter data collection (MVP mode)"
echo "✅ Insight compilation"
echo "✅ Complete workflow integration"
echo "✅ Error handling"
echo ""
echo "🚀 Seinsight AI workflow is ready for MVP demonstration!"
echo ""
echo "💡 Next steps:"
echo "   1. Start the backend server (npm run dev in backend/)"
echo "   2. Configure API keys in .env file"
echo "   3. Test with real user input"
echo "   4. Monitor API usage for rate limits"
echo ""
