import { Provider } from '@elizaos/core';

// NOTE: These providers are currently not being used by any agents
// They provide contextual data but are not actively accessed
// TODO: Either implement usage in agents or remove if not needed

export const businessContextProvider: Provider = {
  name: 'BUSINESS_CONTEXT',
  description: 'Provides business context and market insights',
  dynamic: true,
  
  get: async (runtime, message, state) => {
    return {
      text: "Business context: Web3 innovation and AI-powered insights",
      data: {
        marketTrends: ['Web3', 'AI', 'Blockchain', 'DeFi'],
        industryInsights: ['Digital transformation', 'Decentralized platforms'],
        competitiveAnalysis: ['Innovation focus', 'Technology adoption']
      }
    };
  }
};

export const socialMediaMetricsProvider: Provider = {
  name: 'SOCIAL_METRICS',
  description: 'Provides real-time social media metrics and performance data',
  dynamic: true,
  
  get: async (runtime, message, state) => {
    return {
      text: "Social media performance: High engagement on Web3 topics",
      data: {
        engagementMetrics: { overall: 85, twitter: 90, instagram: 80 },
        platformPerformance: { twitter: 'High', instagram: 'Medium' },
        trendingTopics: ['Web3', 'AI', 'Blockchain'],
        audienceInsights: { tech_savvy: 70, innovation_focused: 80 }
      }
    };
  }
};

export const hashtagPerformanceProvider: Provider = {
  name: 'HASHTAG_PERFORMANCE',
  description: 'Provides hashtag performance data and recommendations',
  dynamic: true,
  
  get: async (runtime, message, state) => {
    return {
      text: "Top performing hashtags: #Web3, #AI, #Blockchain",
      data: {
        topHashtags: ['#Web3', '#AI', '#Blockchain', '#DeFi'],
        performanceMetrics: { engagement: 85, reach: 1200, clicks: 45 },
        recommendations: ['Use more tech-focused hashtags', 'Include trending topics'],
        trendingHashtags: ['#Innovation', '#Tech', '#Future']
      }
    };
  }
};

export const insightHistoryProvider: Provider = {
  name: 'INSIGHT_HISTORY',
  description: 'Provides historical insight data and patterns',
  dynamic: false,
  
  get: async (runtime, message, state) => {
    return {
      text: "Recent insights: 15 insights available",
      data: {
        recentInsights: [
          'Web3 adoption increasing',
          'AI integration in DeFi platforms',
          'Blockchain scalability solutions'
        ],
        summary: { total: 15, trend: 'positive' },
        trends: ['DeFi growth', 'AI adoption', 'Layer 2 solutions'],
        recommendations: ['Focus on DeFi trends', 'Explore AI integration']
      }
    };
  }
};
