import { Action } from '@elizaos/core';

export const criticalAnalysisAction: Action = {
  name: 'CRITICAL_ANALYSIS',
  description: 'Perform critical analysis of business ideas with balanced perspective',

  validate: async (runtime, message) => {
    return true;
  },

  handler: async (runtime, message) => {
    try {
      const content = typeof message.content === 'string' ? message.content : message.content.text || '';
      
      const analysisPrompt = `You are a business analyst specializing in Web3 and blockchain markets. Analyze the following business idea with a critical and balanced perspective:

${content}

Provide a comprehensive analysis that includes:

1. **Market Risks and Challenges**
   - Regulatory uncertainties
   - Technical complexity
   - Market volatility
   - Competition analysis

2. **Potential Obstacles and Limitations**
   - Scalability issues
   - User adoption challenges
   - Resource requirements
   - Technology dependencies

3. **Competitive Landscape Considerations**
   - Existing solutions
   - Market saturation
   - Differentiation challenges
   - Entry barriers

4. **Realistic Opportunities** (not overly optimistic)
   - Valid use cases
   - Market gaps
   - Partnership potential
   - Revenue streams

5. **Potential Failure Points to Watch For**
   - Common pitfalls
   - Risk factors
   - Warning signs
   - Mitigation strategies

6. **Balanced Recommendations**
   - Strategic approach
   - Risk management
   - Resource allocation
   - Timeline considerations

Be objective, data-driven, and avoid overly positive bias. Focus on actionable insights that help entrepreneurs make informed decisions.`;

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
