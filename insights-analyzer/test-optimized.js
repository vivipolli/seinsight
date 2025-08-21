import fetch from 'node-fetch';

async function testOptimized() {
    console.log('Testing optimized response time...');
    
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
        const sessionId = sessionData.sessionId;
        console.log('Session created:', sessionId);
        
        // Step 2: Send message
        console.log('2. Sending message...');
        await fetch(`${elizaUrl}/api/messaging/sessions/${sessionId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: 'Generate hashtags for: mental health dApps',
                metadata: {
                    requestType: 'hashtag-generation'
                }
            })
        });
        
        // Step 3: Check for response every 5 seconds
        console.log('3. Checking for response...');
        let agentResponse = null;
        const startTime = Date.now();
        
        for (let i = 0; i < 12; i++) { // 12 * 5s = 60s max
            await new Promise(resolve => setTimeout(resolve, 5000));
            const elapsed = Math.round((Date.now() - startTime) / 1000);
            console.log(`   Checking... ${elapsed}s elapsed`);
            
            // Check if agent has responded
            const messagesResponse = await fetch(`${elizaUrl}/api/messaging/sessions/${sessionId}/messages`);
            const messagesData = await messagesResponse.json();
            
            const agentMessages = messagesData.messages.filter(msg => msg.isAgent);
            if (agentMessages.length > 0) {
                agentResponse = agentMessages[agentMessages.length - 1].content;
                console.log(`✅ Agent responded in ${elapsed}s!`);
                console.log('Response:', agentResponse);
                break;
            }
        }
        
        if (!agentResponse) {
            console.log('❌ Agent did not respond within 60 seconds');
        }
        
        // Clean up
        await fetch(`${elizaUrl}/api/messaging/sessions/${sessionId}`, {
            method: 'DELETE'
        });
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testOptimized();
