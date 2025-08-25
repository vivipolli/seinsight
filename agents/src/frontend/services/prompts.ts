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
    return `Analyze this Twitter data for Web3 market insights:

${twitterDataSummary}

Provide:
1. Main risks and challenges
2. Key opportunities 
3. Strategic recommendations

Be objective and data-driven. Keep analysis under 200 words.`;
  }
}
