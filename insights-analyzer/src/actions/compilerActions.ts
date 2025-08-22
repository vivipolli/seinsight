import { Action } from '@elizaos/core';

export const criticalAnalysisAction: Action = {
  name: 'CRITICAL_ANALYSIS',
  description: 'Perform critical analysis of business ideas with balanced perspective',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('analyze') ||
           content.toLowerCase().includes('analysis') ||
           content.toLowerCase().includes('critical') ||
           content.toLowerCase().includes('business') ||
           content.toLowerCase().includes('idea');
  },

  handler: async (runtime, message) => {
    try {
      const content = typeof message.content === 'string' ? message.content : message.content.text || '';
      
      // Use AI model to generate critical analysis
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

export const compileInsightsAction: Action = {
  name: 'COMPILE_INSIGHTS',
  description: 'Compile all collected insights into a comprehensive report',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('compile') ||
           content.toLowerCase().includes('insights') ||
           content.toLowerCase().includes('report') ||
           content.toLowerCase().includes('summary');
  },

  handler: async (runtime, message) => {
    try {
      // Use AI model to generate insights compilation
      const compilationPrompt = `You are an insights compiler. Create a comprehensive report based on the following request:

${typeof message.content === 'string' ? message.content : message.content.text || ''}

Provide a structured report that includes:

1. **Executive Summary**
   - Key findings
   - Overall assessment
   - Strategic implications

2. **Data Analysis**
   - Trends identified
   - Patterns observed
   - Statistical insights

3. **Market Intelligence**
   - Competitive landscape
   - Market opportunities
   - Risk factors

4. **Strategic Recommendations**
   - Actionable insights
   - Priority areas
   - Implementation guidance

5. **Next Steps**
   - Immediate actions
   - Long-term strategy
   - Success metrics

Be comprehensive, objective, and provide actionable insights.`;

      const response = await runtime.useModel('TEXT_LARGE', {
        prompt: compilationPrompt
      });

      return { success: true, text: response };
    } catch (error) {
      console.error('Insights compilation error:', error);
      return { success: false, text: "❌ Error compiling insights. Please try again." };
    }
  }
};

export const generateStrategicReportAction: Action = {
  name: 'GENERATE_STRATEGIC_REPORT',
  description: 'Generate strategic recommendations based on compiled insights',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('strategic') ||
           content.toLowerCase().includes('recommendations') ||
           content.toLowerCase().includes('strategy') ||
           content.toLowerCase().includes('plan');
  },

  handler: async (runtime, message) => {
    try {
      // Use AI model to generate strategic report
      const strategicPrompt = `You are a strategic business consultant. Generate strategic recommendations based on the following request:

${typeof message.content === 'string' ? message.content : message.content.text || ''}

Provide a strategic report that includes:

1. **Strategic Assessment**
   - Current situation analysis
   - Strengths and weaknesses
   - Opportunities and threats

2. **Strategic Recommendations**
   - Short-term actions (0-6 months)
   - Medium-term strategy (6-18 months)
   - Long-term vision (18+ months)

3. **Implementation Roadmap**
   - Priority initiatives
   - Resource requirements
   - Timeline and milestones

4. **Risk Management**
   - Potential risks
   - Mitigation strategies
   - Contingency plans

5. **Success Metrics**
   - KPIs and metrics
   - Performance indicators
   - Evaluation criteria

Be strategic, practical, and provide clear actionable guidance.`;

      const response = await runtime.useModel('TEXT_LARGE', {
        prompt: strategicPrompt
      });

      return { success: true, text: response };
    } catch (error) {
      console.error('Strategic report error:', error);
      return { success: false, text: "❌ Error generating strategic report. Please try again." };
    }
  }
};
