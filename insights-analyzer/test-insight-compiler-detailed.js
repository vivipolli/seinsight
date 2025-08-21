import fetch from 'node-fetch';
import { twitterMockData } from './src/mocks/twitterMockData.js';

async function testInsightCompilerDetailed() {
    console.log('Testing InsightCompiler with detailed analysis...');
    
    const elizaUrl = 'http://localhost:3000';
    const agentId = '3643e20d-b322-0e3e-a089-87f323dc94ad'; // InsightCompiler UUID
    
    try {
        // Step 1: Create session
        console.log('1. Creating session...');
        const sessionResponse = await fetch(`${elizaUrl}/api/messaging/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                agentId: agentId,
                userId: '550e8400-e29b-41d4-a716-446655440000',
                metadata: {
                    platform: 'test',
                    purpose: 'insight-compilation'
                }
            })
        });
        
        const sessionData = await sessionResponse.json();
        if (!sessionData.sessionId) {
            throw new Error('Failed to create session');
        }
        
        const sessionId = sessionData.sessionId;
        console.log('Session created:', sessionId);
        
        // Step 2: Send analysis request with Twitter data
        console.log('2. Sending analysis request...');
        
        // Extract only tweet texts to reduce message size
        const tweetTexts = twitterMockData.tweets.map(tweet => ({
            text: tweet.text,
            sentiment: tweet.sentiment,
            engagement: tweet.like_count + tweet.retweet_count
        }));
        
        const analysisMessage = `
Analyze this Twitter data for mental health dApps on blockchain and provide a COMPLETE analysis:

BUSINESS CONTEXT: Mental health dApps on blockchain market analysis
HASHTAGS: #MentalHealth, #Blockchain, #Web3, #TechForGood

TWITTER DATA (${tweetTexts.length} tweets):
${JSON.stringify(tweetTexts, null, 2)}

REQUIRED ANALYSIS:
1. Market Sentiment Analysis - Analyze the sentiment of all tweets
2. Key Insights and Trends - Identify main patterns and trends in the data
3. Opportunities - List specific opportunities for mental health dApps
4. Challenges - List specific challenges and risks
5. Strategic Recommendations - Provide actionable strategic advice
6. Action Items - List specific next steps for the business

Please provide a COMPLETE analysis with all sections above. Do not just confirm you will analyze - actually perform the analysis now.
        `;
        
        await fetch(`${elizaUrl}/api/messaging/sessions/${sessionId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: analysisMessage,
                metadata: {
                    requestType: 'insight-compilation'
                }
            })
        });
        
        // Step 3: Wait for response with progress updates
        console.log('3. Waiting for response...');
        for (let i = 0; i < 12; i++) { // Wait up to 2 minutes
            await new Promise(resolve => setTimeout(resolve, 10000));
            console.log(`   Waiting... ${(i+1)*10}s`);
            
            // Check for messages every 10 seconds
            const messagesResponse = await fetch(`${elizaUrl}/api/messaging/sessions/${sessionId}/messages`);
            const messagesData = await messagesResponse.json();
            
            const agentMessages = messagesData.messages.filter(msg => msg.isAgent);
            if (agentMessages.length > 1) { // More than just the initial confirmation
                console.log('Found additional response!');
                console.log('Latest agent message:', agentMessages[agentMessages.length - 1].content);
                break;
            }
        }
        
        // Step 4: Get final messages
        console.log('4. Getting final messages...');
        const messagesResponse = await fetch(`${elizaUrl}/api/messaging/sessions/${sessionId}/messages`);
        const messagesData = await messagesResponse.json();
        
        console.log('All messages:', JSON.stringify(messagesData, null, 2));
        
        // Step 5: Clean up session
        await fetch(`${elizaUrl}/api/messaging/sessions/${sessionId}`, {
            method: 'DELETE'
        });
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testInsightCompilerDetailed();
