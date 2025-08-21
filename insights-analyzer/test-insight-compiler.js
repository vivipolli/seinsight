import fetch from 'node-fetch';
import { twitterMockData } from './src/mocks/twitterMockData.js';

async function testInsightCompiler() {
    console.log('Testing InsightCompiler with Twitter mock data...');
    
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
        const analysisMessage = `
Compile insights for: Mental health dApps on blockchain

Hashtags generated: #MentalHealth, #Blockchain, #Web3, #TechForGood

Twitter Data for Analysis:
${JSON.stringify(twitterMockData, null, 2)}

Please analyze this Twitter data and provide:
1. Market sentiment analysis
2. Key insights and trends
3. Opportunities and challenges
4. Strategic recommendations
5. Action items for the business

Focus on providing balanced insights considering both opportunities and risks.
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
        
        // Step 3: Wait for response
        console.log('3. Waiting for response...');
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 60 seconds
        
        // Step 4: Get messages
        const messagesResponse = await fetch(`${elizaUrl}/api/messaging/sessions/${sessionId}/messages`);
        const messagesData = await messagesResponse.json();
        
        console.log('Messages:', JSON.stringify(messagesData, null, 2));
        
        // Step 5: Clean up session
        await fetch(`${elizaUrl}/api/messaging/sessions/${sessionId}`, {
            method: 'DELETE'
        });
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testInsightCompiler();
