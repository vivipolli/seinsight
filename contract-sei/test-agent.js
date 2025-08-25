const axios = require('axios');

async function testInsightCompiler() {
  console.log('Testing InsightCompiler agent...');
  
  const elizaUrl = 'http://localhost:3000';
  const agentId = '3643e20d-b322-0e3e-a089-87f323dc94ad'; // InsightCompiler UUID
  
  try {
    // Step 1: Create session
    console.log('1. Creating session...');
    const sessionResponse = await axios.post(`${elizaUrl}/api/messaging/sessions`, {
      agentId: agentId,
      userId: '550e8400-e29b-41d4-a716-446655440000',
      metadata: {
        platform: 'backend',
        purpose: 'insight-compilation'
      }
    });
    
    if (!sessionResponse.data.sessionId) {
      throw new Error('Failed to create session');
    }
    
    const sessionId = sessionResponse.data.sessionId;
    console.log('Session created:', sessionId);
    
    // Step 2: Send message
    console.log('2. Sending message...');
    await axios.post(`${elizaUrl}/api/messaging/sessions/${sessionId}/messages`, {
      content: 'Compile insights from mental health dApp analysis',
      metadata: {
        sessionId: sessionId,
        requestType: 'insight-compilation'
      }
    });
    
    // Step 3: Wait for response
    console.log('3. Waiting for response...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Step 4: Get messages
    const messagesResponse = await axios.get(`${elizaUrl}/api/messaging/sessions/${sessionId}/messages`);
    console.log('Messages:', JSON.stringify(messagesResponse.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testInsightCompiler();
