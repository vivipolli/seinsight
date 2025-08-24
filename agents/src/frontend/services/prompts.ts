export class Prompts {
  static getCriticalAnalysisPrompt(businessDescription: string, hashtags: string[], twitterDataSummary: string): string {
    return `CRITICAL_ANALYSIS: Analyze this business idea for Web3 entrepreneurs with a critical and balanced perspective based on the collected Twitter data:

**Business Context:** ${businessDescription}
**Target Hashtags:** ${hashtags.join(', ')}

**Twitter Data Analysis:**
${twitterDataSummary}

Please provide a critical analysis that includes:

1. **Market Sentiment Analysis** (based on Twitter data)
   - Overall sentiment trends
   - Key concerns and challenges mentioned
   - Positive signals and opportunities

2. **Market Risks and Challenges** (identified from social data)
   - Regulatory concerns mentioned
   - Technical challenges discussed
   - Market volatility indicators
   - Competition insights

3. **Potential Obstacles and Limitations**
   - Scalability issues mentioned
   - User adoption challenges
   - Resource requirements
   - Technology dependencies

4. **Competitive Landscape Considerations**
   - Existing solutions discussed
   - Market saturation indicators
   - Differentiation challenges
   - Entry barriers

5. **Realistic Opportunities** (based on social sentiment)
   - Valid use cases mentioned
   - Market gaps identified
   - Partnership potential
   - Revenue streams

6. **Potential Failure Points to Watch For**
   - Common pitfalls mentioned
   - Risk factors identified
   - Warning signs from community
   - Mitigation strategies

7. **Balanced Recommendations**
   - Strategic approach based on data
   - Risk management
   - Resource allocation
   - Timeline considerations

Be objective, data-driven, and base your analysis on the actual Twitter data collected. Focus on actionable insights that help entrepreneurs make informed decisions.`;
  }
}
