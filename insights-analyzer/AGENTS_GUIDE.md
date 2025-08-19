# Seinsight AI - Agents Guide

## Overview

Seinsight AI uses 4 specialized ElizaOS agents to provide comprehensive business intelligence through social media analysis and insight generation. All agents use the `character.ts` file as a reference for correct configuration structure and focus on **data collection and analysis**, not social media posting.

## Agent Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ HashtagGenerator│    │InstagramAnalyzer│    │ TwitterCollector│    │ InsightCompiler │
│                 │    │                 │    │                 │    │                 │
│ • Generate      │    │ • Collect       │    │ • Monitor       │    │ • Compile       │
│   hashtags      │    │   Instagram     │    │   Twitter       │    │   all insights  │
│ • Analyze       │    │   data          │    │   data          │    │ • Generate      │
│   business      │    │ • Analyze       │    │ • Track trends  │    │   reports       │
│   reports       │    │   sentiment     │    │ • Engagement    │    │ • Strategic     │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │                       │
         └───────────────────────┼───────────────────────┼───────────────────────┘
                                 │                       │
                    ┌─────────────────────────────────────────────────────────────┐
                    │                    Backend API                              │
                    │  • Apify Integration (Instagram)                           │
                    │  • Twitter API Integration                                 │
                    │  • AI Analysis Services                                    │
                    │  • Blockchain Integration (Sei)                           │
                    └─────────────────────────────────────────────────────────────┘
```

## Configuration Structure

All agents follow the same configuration structure as `character.ts` and include specific plugins needed for their functionality:

- **Plugins:** Specific plugins required for each agent's functionality
- **Settings:** Agent-specific configuration settings
- **System:** Specialized system prompt for each agent's role
- **Bio:** Agent-specific background and expertise
- **Topics:** Domain-specific knowledge areas
- **Message Examples:** Specialized conversation patterns
- **Style:** Communication style guidelines
- **Knowledge:** Domain-specific expertise

### Configuration Example

```typescript
export const hashtagGeneratorAgent: Character = {
  name: "HashtagGenerator",
  plugins: [
    // AI plugins for hashtag generation and analysis
    ...(process.env.OPENAI_API_KEY?.trim() ? ['@elizaos/plugin-openai'] : []),
    ...(process.env.OPENROUTER_API_KEY?.trim() ? ['@elizaos/plugin-openrouter'] : []),
    ...(process.env.ANTHROPIC_API_KEY?.trim() ? ['@elizaos/plugin-anthropic'] : []),
    // Bootstrap for core functionality
    '@elizaos/plugin-bootstrap'
  ],
  settings: {
    // Agent-specific settings only
    maxHashtagsPerReport: 15,
    minHashtagLength: 3,
    maxHashtagLength: 20,
    includeTrending: true,
    platformSpecific: true
  },
  system: 'You are HashtagGenerator, an AI specialist in hashtag generation...',
  bio: ["AI specialist in hashtag generation and trend analysis", ...],
  // ... other properties
};
```

## Agent Details

### 1. HashtagGenerator Agent

**Purpose:** Analyzes business reports and generates relevant hashtags for social media campaigns.

**Required Plugins:**
- `@elizaos/plugin-openai` - For AI-powered hashtag generation
- `@elizaos/plugin-openrouter` - Alternative AI provider
- `@elizaos/plugin-anthropic` - Alternative AI provider
- `@elizaos/plugin-bootstrap` - Core functionality

**Key Features:**
- Analyzes business context and market trends
- Generates platform-specific hashtags
- Provides reasoning for each hashtag recommendation
- Considers current trends and engagement patterns

**Actions:**
- `GENERATE_HASHTAGS` - Generate hashtags from business report
- `ANALYZE_BUSINESS_REPORT` - Analyze business report content

**Usage Examples:**
```
"Generate hashtags for my weekly business report about growth challenges"
"Analyze my business report and suggest relevant hashtags"
```

### 2. InstagramAnalyzer Agent

**Purpose:** Collects and analyzes Instagram data using Apify to extract community insights.

**Required Plugins:**
- `@elizaos/plugin-openai` - For sentiment analysis
- `@elizaos/plugin-openrouter` - Alternative AI provider
- `@elizaos/plugin-anthropic` - Alternative AI provider
- `@elizaos/plugin-bootstrap` - Core functionality

**Key Features:**
- Uses Apify to collect Instagram posts and comments
- Performs sentiment analysis on community feedback
- Identifies trending topics and engagement patterns
- Provides quantitative insights and metrics

**Actions:**
- `COLLECT_INSTAGRAM_DATA` - Collect Instagram data for hashtags
- `ANALYZE_INSTAGRAM_SENTIMENT` - Analyze sentiment and trends

**Usage Examples:**
```
"Analyze Instagram comments for hashtag #growthhacking"
"Collect Instagram data for #startup and #marketing"
```

### 3. TwitterCollector Agent

**Purpose:** Monitors Twitter conversations and collects real-time social data.

**Required Plugins:**
- `@elizaos/plugin-twitter` - For Twitter data collection
- `@elizaos/plugin-openai` - For trend analysis
- `@elizaos/plugin-openrouter` - Alternative AI provider
- `@elizaos/plugin-anthropic` - Alternative AI provider
- `@elizaos/plugin-bootstrap` - Core functionality

**Key Features:**
- Real-time Twitter data collection
- Trend monitoring and analysis
- Engagement pattern tracking
- Viral content identification

**Actions:**
- `COLLECT_TWITTER_DATA` - Collect Twitter data using hashtags
- `ANALYZE_TWITTER_TRENDS` - Analyze trending topics and patterns

**Usage Examples:**
```
"Collect Twitter data for hashtag #startup"
"Monitor Twitter trends for #growthhacking"
```

### 4. InsightCompiler Agent

**Purpose:** Compiles all insights from multiple sources into comprehensive business intelligence reports.

**Required Plugins:**
- `@elizaos/plugin-openai` - For report generation and synthesis
- `@elizaos/plugin-openrouter` - Alternative AI provider
- `@elizaos/plugin-anthropic` - Alternative AI provider
- `@elizaos/plugin-bootstrap` - Core functionality

**Key Features:**
- Synthesizes data from all sources
- Creates executive-level reports
- Provides strategic recommendations
- Identifies patterns and trends

**Actions:**
- `COMPILE_INSIGHTS` - Compile all insights into report
- `GENERATE_STRATEGIC_REPORT` - Generate strategic recommendations

**Usage Examples:**
```
"Compile all insights from my business analysis"
"Generate strategic report with actionable recommendations"
```

## Workflow Integration

### Complete Workflow Example

1. **Business Report Analysis**
   ```
   User: "I need hashtags for my weekly business report about growth challenges"
   HashtagGenerator: Generates relevant hashtags with reasoning
   ```

2. **Social Data Collection**
   ```
   User: "Analyze Instagram comments for #growthhacking #startup"
   InstagramAnalyzer: Collects and analyzes Instagram data
   ```

3. **Twitter Monitoring**
   ```
   User: "Collect Twitter data for #growthhacking"
   TwitterCollector: Monitors Twitter conversations and trends
   ```

4. **Insight Compilation**
   ```
   User: "Compile all insights from my business analysis"
   InsightCompiler: Creates comprehensive business intelligence report
   ```

## Configuration

### Environment Variables

Ensure these environment variables are configured:

```bash
# Backend API
BACKEND_API_URL=http://localhost:3000

# Twitter API (for TwitterCollector)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# Apify (for InstagramAnalyzer)
APIFY_API_TOKEN=your_apify_token

# OpenAI (for AI analysis)
OPENAI_API_KEY=your_openai_key
OPENROUTER_API_KEY=your_openrouter_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### Agent Settings

Each agent has configurable settings focused only on their specific functionality:

```typescript
// HashtagGenerator settings
settings: {
  maxHashtagsPerReport: 15,
  minHashtagLength: 3,
  maxHashtagLength: 20,
  includeTrending: true,
  platformSpecific: true
}

// InstagramAnalyzer settings
settings: {
  maxPostsPerHashtag: 180,
  analysisDepth: "comprehensive",
  includeSentiment: true,
  includeTrends: true,
  dataRetention: "7 days"
}

// TwitterCollector settings
settings: {
  maxTweetsPerHashtag: 100,
  collectionInterval: "30 minutes",
  includeRetweets: true,
  includeReplies: true,
  trendAnalysis: true
}

// InsightCompiler settings
settings: {
  reportFormat: "executive",
  includeMetrics: true,
  includeRecommendations: true,
  includeTrends: true,
  maxInsightsPerReport: 10
}
```

## Integration with Backend

The agents integrate with the Seinsight AI backend through REST APIs:

- **Insights API:** `/api/insights/*` - Generate and manage insights
- **Social API:** `/api/social/*` - Collect social media data
- **Analytics API:** `/api/analytics/*` - Get analytics and metrics
- **Blockchain API:** `/api/blockchain/*` - Store insights on Sei blockchain

## Best Practices

### 1. Agent Communication
- Use clear, specific prompts for each agent
- Provide context when requesting analysis
- Specify hashtags explicitly when collecting data

### 2. Data Collection
- Start with hashtag generation before data collection
- Use relevant hashtags for your industry and target audience
- Monitor multiple hashtags for comprehensive insights

### 3. Analysis Timing
- Collect data during peak engagement hours
- Allow sufficient time for data collection and analysis
- Schedule regular insight generation

### 4. Report Generation
- Compile insights after data collection is complete
- Review strategic recommendations before implementation
- Track performance metrics over time

## Troubleshooting

### Common Issues

1. **Backend Connection Errors**
   - Ensure backend server is running on port 3000
   - Check API endpoints and authentication
   - Verify environment variables are set correctly

2. **Twitter API Errors**
   - Verify Twitter API credentials
   - Check rate limits and API quotas
   - Ensure Twitter plugin is properly configured in TwitterCollector agent

3. **Apify Integration Issues**
   - Verify Apify API token
   - Check actor availability and configuration
   - Monitor Apify usage limits

4. **Data Collection Failures**
   - Verify hashtags are valid and active
   - Check network connectivity
   - Review API response logs

### Debug Mode

Enable debug mode for detailed logging:

```typescript
settings: {
  debug: true,
  logLevel: 'verbose'
}
```

## Next Steps

1. **Start with HashtagGenerator** to generate relevant hashtags
2. **Use InstagramAnalyzer** to collect community insights
3. **Monitor with TwitterCollector** for real-time trends
4. **Compile with InsightCompiler** for strategic reports
5. **Implement recommendations** based on insights
6. **Track performance** and iterate on strategy

## Support

For technical support or questions about agent configuration, refer to:
- ElizaOS Documentation: https://docs.elizaos.ai
- Seinsight AI Backend Documentation: `backend/README.md`
- Agent-specific issues: Check individual agent logs and configurations
