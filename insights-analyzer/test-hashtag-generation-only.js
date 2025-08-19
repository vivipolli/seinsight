import axios from 'axios';

const ELIZAOS_URL = 'http://localhost:3000';

async function testHashtagGeneration() {
  console.log('\n🧪 **TESTE REAL: Geração de Hashtags via ElizaOS Sessions API**\n');

  const userInput = 'Preciso avaliar no mercado os interesses por verificação de media e conteúdo na blockchain, também sobre a necessidade de comprovação e validação de media como autenticas e não geradas por IA.';

  try {
    console.log('📝 Input do usuário:');
    console.log(userInput);
    console.log('\n🔍 Obtendo lista de agentes...\n');

    // First get the list of agents to find the correct ID
    const agentsResponse = await axios.get(`${ELIZAOS_URL}/api/agents`);
    const hashtagAgent = agentsResponse.data.data.agents.find(agent => agent.name === 'HashtagGenerator');
    
    if (!hashtagAgent) {
      throw new Error('HashtagGenerator agent not found');
    }

    console.log('✅ Agente encontrado:', hashtagAgent.id);
    console.log('🔍 Criando sessão com ElizaOS HashtagGenerator...\n');

    // Step 1: Create a session with the HashtagGenerator agent using the correct UUID
    const sessionResponse = await axios.post(`${ELIZAOS_URL}/api/messaging/sessions`, {
      agentId: hashtagAgent.id,
      userId: '00000000-0000-0000-0000-000000000001', // Use a valid UUID
      metadata: {
        platform: 'test',
        purpose: 'hashtag-generation-test'
      }
    });

    if (!sessionResponse.data.sessionId) {
      throw new Error('Failed to create session with HashtagGenerator');
    }

    const sessionId = sessionResponse.data.sessionId;
    console.log('✅ Sessão criada:', sessionId);

    // Step 2: Send the business report to generate hashtags
    console.log('🤖 Enviando input para o HashtagGenerator...');
    
    const messageResponse = await axios.post(
      `${ELIZAOS_URL}/api/messaging/sessions/${sessionId}/messages`,
      {
        content: `Por favor, gere hashtags Web3 específicas para este contexto: ${userInput}. Responda apenas com as hashtags relevantes.`,
        metadata: {
          requestType: 'hashtag-generation',
          timestamp: new Date().toISOString()
        }
      }
    );

    if (messageResponse.data && messageResponse.data.content) {
      console.log('✅ Resposta REAL do HashtagGenerator:');
      console.log('📄 Conteúdo:', messageResponse.data.content);
      console.log('🤔 Pensamento interno:', messageResponse.data.metadata?.thought || 'N/A');
      console.log('📊 Metadados:', messageResponse.data.metadata || 'N/A');
      
      // Extract hashtags from the real response
      const hashtags = extractHashtagsFromResponse(messageResponse.data.content);
      console.log('🏷️ Hashtags extraídas:', hashtags);
      
    } else {
      console.log('❌ Resposta vazia do agente');
    }

    // Step 3: End the session
    await axios.delete(`${ELIZAOS_URL}/api/messaging/sessions/${sessionId}`);
    console.log('✅ Sessão finalizada');

  } catch (error) {
    console.error('❌ ERRO:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

// Extract hashtags from agent response
function extractHashtagsFromResponse(response) {
  const hashtags = [];
  
  // Look for hashtags in the response
  const hashtagRegex = /#(\w+)/g;
  const matches = response.match(hashtagRegex);
  
  if (matches) {
    hashtags.push(...matches.map(tag => tag.substring(1))); // Remove # symbol
  }
  
  return [...new Set(hashtags)]; // Remove duplicates
}

testHashtagGeneration();
