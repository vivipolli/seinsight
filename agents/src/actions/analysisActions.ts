import { Action } from '@elizaos/core';
import { twitterMockData } from '../mocks/twitterMockData.js';

export const criticalAnalysisAction: Action = {
  name: 'CRITICAL_ANALYSIS',
  description: 'Perform critical analysis of business ideas with balanced perspective',

  validate: async (runtime, message) => {
    return true;
  },

  handler: async (runtime, message) => {
    try {
      const content = twitterMockData.tweets; // TODO: change to the actual twitter data
      
      const analysisPrompt = `Analyze this Twitter data for Web3 market insights. Focus on key risks, opportunities, and actionable recommendations. Be concise and objective.

      Data: ${JSON.stringify(content).substring(0, 1000)}

      Provide:
      1. Main risks and challenges
      2. Key opportunities 
      3. Strategic recommendations

      Keep analysis under 200 words.`;

      const response = await runtime.useModel('TEXT_LARGE', {
        prompt: analysisPrompt
      });

      return { success: true, text: response };
    } catch (error) {
      console.error('Critical analysis error:', error);
      return { success: false, text: "❌ Error performing critical analysis. Please try again." };
    }
  }
};
