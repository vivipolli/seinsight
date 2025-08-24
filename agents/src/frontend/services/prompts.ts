export class Prompts {
  static getSignalGenerationPrompt(twitterDataSummary: string): string {
    return `GENERATE_TOP3_SIGNALS: Based on the Twitter data analysis below, generate the top 3 most relevant market signals for blockchain entrepreneurs:

**Twitter Data Analysis:**
${twitterDataSummary}

Please generate 3 market signals that:
1. Are based on the actual Twitter sentiment and discussions
2. Identify emerging trends or opportunities
3. Highlight potential market gaps or needs
4. Consider the community sentiment and engagement levels
5. Focus on actionable insights for Web3 entrepreneurs

Format each signal as:
- **Signal Title**: Brief description
- **Rationale**: Why this signal is important based on the Twitter data
- **Actionable Insight**: What entrepreneurs should consider

Base your signals ONLY on the Twitter data provided, not on any external knowledge.`;
  }

  static getCriticalAnalysisPrompt(twitterDataSummary: string): string {
    return `CRITICAL_ANALYSIS: Analyze the Twitter data below to provide a critical and balanced market analysis for Web3 entrepreneurs:

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

Be objective, data-driven, and base your analysis ONLY on the Twitter data provided. Focus on actionable insights that help entrepreneurs make informed decisions.`;
  }
}
