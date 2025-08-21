import fetch from 'node-fetch';

async function testHashtagGenerator() {
    console.log('Testing HashtagGenerator...');
    
    const elizaUrl = 'http://localhost:3000';
    const agentId = '635b4207-35ce-0ec5-a517-52445ae58215'; // HashtagGenerator UUID
    
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
                    purpose: 'hashtag-generation'
                }
            })
        });
        
        const sessionData = await sessionResponse.json();
        if (!sessionData.sessionId) {
            throw new Error('Failed to create session');
        }
        
        const sessionId = sessionData.sessionId;
        console.log('Session created:', sessionId);
        
        // Step 2: Send message
        console.log('2. Sending message...');
        await fetch(`${elizaUrl}/api/messaging/sessions/${sessionId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: 'Generate hashtags for: Preciso avaliar o crescimento de dapps de saude no mercado',
                metadata: {
                    requestType: 'hashtag-generation'
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

testHashtagGenerator();
