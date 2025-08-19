import { Provider } from '@elizaos/core';

export const businessContextProvider: Provider = {
  name: 'BUSINESS_CONTEXT',
  description: 'Provides business context and market insights',
  dynamic: true,
  
  get: async (runtime, message, state) => {
    try {
      // Get business context from backend
      const response = await fetch('http://localhost:8080/api/analytics/business-context', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json() as any;
      
      return {
        text: `Current business context: ${data.context}`,
        data: {
          marketTrends: data.trends || [],
          industryInsights: data.insights || [],
          competitiveAnalysis: data.competition || []
        }
      };
    } catch (error) {
      return {
        text: "Business context unavailable",
        data: {
          marketTrends: [],
          industryInsights: [],
          competitiveAnalysis: []
        }
      };
    }
  }
};

export const socialMediaMetricsProvider: Provider = {
  name: 'SOCIAL_METRICS',
  description: 'Provides real-time social media metrics and performance data',
  dynamic: true,
  
  get: async (runtime, message, state) => {
    try {
      // Get social media metrics from backend
      const response = await fetch('http://localhost:8080/api/analytics/social-metrics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json() as any;
      
      return {
        text: `Social media performance: ${data.overallScore || 'N/A'} engagement score`,
        data: {
          engagementMetrics: data.engagement || {},
          platformPerformance: data.platforms || {},
          trendingTopics: data.trends || [],
          audienceInsights: data.audience || {}
        }
      };
    } catch (error) {
      return {
        text: "Social media metrics unavailable",
        data: {
          engagementMetrics: {},
          platformPerformance: {},
          trendingTopics: [],
          audienceInsights: {}
        }
      };
    }
  }
};

export const hashtagPerformanceProvider: Provider = {
  name: 'HASHTAG_PERFORMANCE',
  description: 'Provides hashtag performance data and recommendations',
  dynamic: true,
  
  get: async (runtime, message, state) => {
    try {
      // Get hashtag performance from backend
      const response = await fetch('http://localhost:8080/api/analytics/hashtag-performance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json() as any;
      
      return {
        text: `Top performing hashtags: ${(data.topHashtags || []).join(', ')}`,
        data: {
          topHashtags: data.topHashtags || [],
          performanceMetrics: data.metrics || {},
          recommendations: data.recommendations || [],
          trendingHashtags: data.trending || []
        }
      };
    } catch (error) {
      return {
        text: "Hashtag performance data unavailable",
        data: {
          topHashtags: [],
          performanceMetrics: {},
          recommendations: [],
          trendingHashtags: []
        }
      };
    }
  }
};

export const insightHistoryProvider: Provider = {
  name: 'INSIGHT_HISTORY',
  description: 'Provides historical insight data and patterns',
  dynamic: false,
  
  get: async (runtime, message, state) => {
    try {
      // Get insight history from backend
      const response = await fetch('http://localhost:8080/api/insights/history/user123?limit=10', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json() as any;
      
      return {
        text: `Recent insights: ${(data.insights || []).length} insights available`,
        data: {
          recentInsights: data.insights || [],
          summary: data.summary || {},
          trends: data.trends || [],
          recommendations: data.recommendations || []
        }
      };
    } catch (error) {
      return {
        text: "Insight history unavailable",
        data: {
          recentInsights: [],
          patterns: [],
          trends: [],
          recommendations: []
        }
      };
    }
  }
};
