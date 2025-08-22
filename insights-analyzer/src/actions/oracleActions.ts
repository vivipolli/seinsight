import { Action } from '@elizaos/core';
import { blockchainService, type SignalBatch } from '../services/blockchainService';
import { ORACLE_CONFIG } from '../contracts/oracleConfig';

export const generateTop3SignalsAction: Action = {
  name: 'GENERATE_TOP3_SIGNALS',
  description: 'Generate top 3 community signals from social media data for oracle publication',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('top 3') ||
           content.toLowerCase().includes('signals') ||
           content.toLowerCase().includes('oracle') ||
           content.toLowerCase().includes('trending');
  },

  handler: async (runtime, message) => {
    try {
      const content = typeof message.content === 'string' ? message.content : message.content.text || '';
      
      // Create prompt for AI to analyze and rank signals
      const prompt = [
        'You are analyzing social media data to identify the top 3 trending signals in the Web3/blockchain community.',
        'Based on the following criteria, rank and select exactly 3 signals:',
        '- Engagement weight: 3×retweets + 2×likes + 4×replies',
        '- Recency: prioritize recent mentions (last 30-60 minutes)',
        '- Velocity: signals gaining momentum quickly',
        '- Diversity: mentioned by multiple different authors',
        '- Web3 relevance: must relate to blockchain, crypto, DeFi, NFTs, or Web3',
        '',
        'Input context: ' + content,
        '',
        'Response format (JSON):',
        '{',
        '  "signals": [',
        '    {',
        '      "name": "#SignalName",',
        '      "score": 85,',
        '      "confidence": "high",',
        '      "mentions": 45,',
        '      "uniqueAuthors": 12,',
        '      "avgEngagement": 165,',
        '      "reason": "High engagement with strong velocity"',
        '    }',
        '  ],',
        '  "windowStart": "2024-01-15T10:00:00Z",',
        '  "windowEnd": "2024-01-15T11:00:00Z"',
        '}'
      ].join('\n');

      const aiResponse = await runtime.useModel(prompt, {
        model: 'openrouter/mistralai/mistral-7b-instruct:free'
      });

      const rawResponse = typeof aiResponse === 'string' ? aiResponse : String(aiResponse);
      
      // Try to extract JSON from response
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      
      const analysisResult = JSON.parse(jsonMatch[0]);

      // Generate mock CID (in real implementation, this would upload to IPFS)
      const mockCID = `bafybeig${Math.random().toString(36).substring(2, 15)}`;
      
      // Prepare signal batch for blockchain
      const signalBatch: SignalBatch = {
        windowStart: Math.floor(new Date(analysisResult.windowStart).getTime() / 1000),
        windowEnd: Math.floor(new Date(analysisResult.windowEnd).getTime() / 1000),
        top3Signals: analysisResult.signals.slice(0, 3).map((s: any) => s.name) as [string, string, string],
        cid: mockCID,
        source: "twitter"
      };

      // Publish to blockchain
      console.log('🔗 Publishing to Sei Oracle...');
      const publishedBatch = await blockchainService.publishSignalBatch(signalBatch);

      // Format response
      let responseText = `🔮 **Community Signal Oracle - Top 3 Signals**\n\n`;
      responseText += `⏰ **Window:** ${new Date(analysisResult.windowStart).toLocaleTimeString()} - ${new Date(analysisResult.windowEnd).toLocaleTimeString()}\n\n`;
      
      responseText += `🏆 **Top 3 Signals:**\n`;
      analysisResult.signals.slice(0, 3).forEach((signal: any, index: number) => {
        responseText += `${index + 1}. **${signal.name}** (Score: ${signal.score})\n`;
        responseText += `   └ ${signal.mentions} mentions, ${signal.uniqueAuthors} authors\n`;
        responseText += `   └ Avg engagement: ${signal.avgEngagement}\n`;
        responseText += `   └ Confidence: ${signal.confidence}\n`;
        responseText += `   └ ${signal.reason}\n\n`;
      });

      responseText += `📊 **Blockchain Publication:**\n`;
      responseText += `└ Contract: \`${ORACLE_CONFIG.contractAddress}\`\n`;
      responseText += `└ Batch ID: ${publishedBatch.batchId}\n`;
      responseText += `└ CID: \`${publishedBatch.cid}\`\n`;
      responseText += `└ Signals: ${publishedBatch.top3Signals.join(', ')}\n`;
      responseText += `└ Tx Hash: \`${publishedBatch.txHash}\`\n\n`;

      responseText += `🔗 **Verification:**\n`;
      responseText += `• Sei Explorer: ${ORACLE_CONFIG.network.explorer}/tx/${publishedBatch.txHash}\n`;
      responseText += `• Contract: ${ORACLE_CONFIG.network.explorer}/address/${ORACLE_CONFIG.contractAddress}\n`;
      responseText += `• IPFS: https://ipfs.io/ipfs/${publishedBatch.cid}\n\n`;

      responseText += `🎯 **Status:**\n`;
      responseText += `• ✅ Published to Sei Oracle\n`;
      responseText += `• ✅ Available for dApp consumption\n`;
      responseText += `• 🔄 Verification pending\n`;

      // Store published batch in runtime settings
      const settings = (runtime.character as any).settings || {};
      settings.latestPublishedBatch = publishedBatch;
      settings.latestSignals = analysisResult.signals.slice(0, 3);
      (runtime.character as any).settings = settings;

      return { success: true, text: responseText };
    } catch (error) {
      return { success: false, text: '❌ Error generating top 3 signals. Please try again.' };
    }
  }
};

export const getOracleStatusAction: Action = {
  name: 'GET_ORACLE_STATUS',
  description: 'Get status and information about the Sei Oracle contract',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('oracle status') ||
           content.toLowerCase().includes('contract status') ||
           content.toLowerCase().includes('oracle info');
  },

  handler: async (runtime, message) => {
    try {
      console.log('🔍 Checking Oracle status...');
      
      // Get contract information
      const contractInfo = blockchainService.getContractInfo();
      
      // Validate connection
      const isConnected = await blockchainService.validateConnection();
      
      // Get latest signals and batch count
      const latestSignals = await blockchainService.getLatestSignals();
      const batchCount = await blockchainService.getBatchCount();
      
      let responseText = `⛓️ **Sei Oracle Status**\n\n`;
      
      responseText += `📊 **Contract Information:**\n`;
      responseText += `├── Address: \`${contractInfo.address}\`\n`;
      responseText += `├── Network: ${contractInfo.network}\n`;
      responseText += `├── Chain ID: ${contractInfo.chainId}\n`;
      responseText += `├── Deployer: \`${contractInfo.deployer}\`\n`;
      responseText += `└── Connection: ${isConnected ? '✅ Connected' : '❌ Disconnected'}\n\n`;
      
      responseText += `📈 **Current State:**\n`;
      responseText += `├── Total Batches: ${batchCount}\n`;
      if (latestSignals) {
        responseText += `├── Latest Signals: ${latestSignals.signals.join(', ')}\n`;
        responseText += `├── Latest CID: \`${latestSignals.cid}\`\n`;
        responseText += `└── Last Update: ${new Date(latestSignals.timestamp * 1000).toLocaleString()}\n\n`;
      } else {
        responseText += `└── Latest Signals: No data available\n\n`;
      }
      
      responseText += `🔗 **Links:**\n`;
      responseText += `├── Contract Explorer: ${contractInfo.explorer}\n`;
      responseText += `├── Network RPC: ${ORACLE_CONFIG.network.rpcUrl}\n`;
      responseText += `└── Faucet: https://faucet.sei-apis.com/\n\n`;
      
      responseText += `🎯 **Next Actions:**\n`;
      responseText += `• Use "generate top 3 signals" to publish new batch\n`;
      responseText += `• Monitor contract events on Sei Explorer\n`;
      responseText += `• Verify published batches for transparency\n`;

      return { success: true, text: responseText };
    } catch (error) {
      return { success: false, text: '❌ Error checking oracle status. Please try again.' };
    }
  }
};
