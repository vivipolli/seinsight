const logger = require('../utils/logger');
const socialService = require('./socialService');

const analyticsService = {
  // Get social analytics overview
  async getSocialAnalytics(projectId, period = '7d') {
    try {
      const socialData = await socialService.getSocialData(projectId);
      
      if (!socialData) {
        return {
          projectId,
          period,
          status: 'no_data',
          analytics: null
        };
      }
      
      const analytics = {
        total_followers: 0,
        total_engagement: 0,
        average_sentiment: 0,
        top_platforms: [],
        growth_rate: 0,
        trending_topics: []
      };
      
      let totalSentiment = 0;
      let platformCount = 0;
      const platformStats = [];
      
      // Aggregate data from all platforms
      for (const [platform, data] of Object.entries(socialData)) {
        if (platform === 'lastUpdated') continue;
        
        if (data.success && data.data) {
          const platformData = data.data;
          
          // Sum followers
          if (platformData.followers) {
            analytics.total_followers += platformData.followers;
          }
          
          // Calculate engagement
          let engagement = 0;
          if (platformData.likes) engagement += platformData.likes;
          if (platformData.retweets) engagement += platformData.retweets;
          if (platformData.comments) engagement += platformData.comments;
          if (platformData.shares) engagement += platformData.shares;
          
          analytics.total_engagement += engagement;
          
          // Calculate sentiment
          if (platformData.sentiment) {
            const sentiment = this.calculateSentimentScore(platformData.sentiment);
            totalSentiment += sentiment;
            platformCount++;
          }
          
          // Platform stats
          platformStats.push({
            platform,
            followers: platformData.followers || 0,
            engagement: engagement,
            engagement_rate: platformData.engagement_rate || 0
          });
        }
      }
      
      // Calculate averages
      if (platformCount > 0) {
        analytics.average_sentiment = totalSentiment / platformCount;
      }
      
      // Top platforms by engagement
      analytics.top_platforms = platformStats
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 3);
      
      // Mock growth rate
      analytics.growth_rate = (Math.random() * 0.3 + 0.05).toFixed(2);
      
      // Mock trending topics
      analytics.trending_topics = ['#growth', '#startup', '#innovation', '#tech'];
      
      return {
        projectId,
        period,
        status: 'success',
        analytics
      };
    } catch (error) {
      logger.error('Error getting social analytics:', error);
      throw error;
    }
  },

  // Get sentiment analysis
  async getSentimentAnalysis(projectId, platform = null, period = '7d') {
    try {
      const socialData = await socialService.getSocialData(projectId, platform);
      
      if (!socialData) {
        return {
          projectId,
          platform,
          period,
          status: 'no_data',
          sentiment: null
        };
      }
      
      const sentimentData = {};
      
      if (platform) {
        // Single platform
        if (socialData.success && socialData.data && socialData.data.sentiment) {
          sentimentData[platform] = {
            ...socialData.data.sentiment,
            score: this.calculateSentimentScore(socialData.data.sentiment)
          };
        }
      } else {
        // All platforms
        for (const [platformName, data] of Object.entries(socialData)) {
          if (platformName === 'lastUpdated') continue;
          
          if (data.success && data.data && data.data.sentiment) {
            sentimentData[platformName] = {
              ...data.data.sentiment,
              score: this.calculateSentimentScore(data.data.sentiment)
            };
          }
        }
      }
      
      return {
        projectId,
        platform,
        period,
        status: 'success',
        sentiment: sentimentData
      };
    } catch (error) {
      logger.error('Error getting sentiment analysis:', error);
      throw error;
    }
  },

  // Get trend analysis
  async getTrendAnalysis(projectId, platform = null, period = '30d') {
    try {
      const socialData = await socialService.getSocialData(projectId, platform);
      
      if (!socialData) {
        return {
          projectId,
          platform,
          period,
          status: 'no_data',
          trends: null
        };
      }
      
      // Mock trend data
      const trends = {
        followers_growth: this.generateTrendData(30),
        engagement_trend: this.generateTrendData(30),
        sentiment_trend: this.generateTrendData(30),
        top_hashtags: ['#growth', '#startup', '#innovation', '#tech', '#ai'],
        peak_hours: [9, 12, 15, 18, 21],
        best_days: ['Monday', 'Wednesday', 'Friday']
      };
      
      return {
        projectId,
        platform,
        period,
        status: 'success',
        trends
      };
    } catch (error) {
      logger.error('Error getting trend analysis:', error);
      throw error;
    }
  },

  // Get engagement metrics
  async getEngagementMetrics(projectId, platform = null, period = '7d') {
    try {
      const socialData = await socialService.getSocialData(projectId, platform);
      
      if (!socialData) {
        return {
          projectId,
          platform,
          period,
          status: 'no_data',
          engagement: null
        };
      }
      
      const engagementData = {};
      
      if (platform) {
        // Single platform
        if (socialData.success && socialData.data) {
          engagementData[platform] = this.extractEngagementMetrics(socialData.data);
        }
      } else {
        // All platforms
        for (const [platformName, data] of Object.entries(socialData)) {
          if (platformName === 'lastUpdated') continue;
          
          if (data.success && data.data) {
            engagementData[platformName] = this.extractEngagementMetrics(data.data);
          }
        }
      }
      
      return {
        projectId,
        platform,
        period,
        status: 'success',
        engagement: engagementData
      };
    } catch (error) {
      logger.error('Error getting engagement metrics:', error);
      throw error;
    }
  },

  // Get benchmarks
  async getBenchmarks(projectId, sector = 'tech', platform = null) {
    try {
      // Mock benchmark data
      const benchmarks = {
        sector,
        platform,
        followers: {
          average: 5000,
          top_25: 10000,
          top_10: 25000
        },
        engagement_rate: {
          average: 0.05,
          top_25: 0.08,
          top_10: 0.12
        },
        sentiment: {
          average: 0.65,
          top_25: 0.75,
          top_10: 0.85
        },
        growth_rate: {
          average: 0.15,
          top_25: 0.25,
          top_10: 0.40
        }
      };
      
      return {
        projectId,
        sector,
        platform,
        status: 'success',
        benchmarks
      };
    } catch (error) {
      logger.error('Error getting benchmarks:', error);
      throw error;
    }
  },

  // Helper methods
  calculateSentimentScore(sentiment) {
    const total = sentiment.positive + sentiment.neutral + sentiment.negative;
    if (total === 0) return 0;
    
    return (sentiment.positive - sentiment.negative) / total;
  },

  extractEngagementMetrics(data) {
    return {
      likes: data.likes || 0,
      comments: data.comments || 0,
      shares: data.shares || 0,
      retweets: data.retweets || 0,
      engagement_rate: data.engagement_rate || 0,
      impressions: data.impressions || 0,
      clicks: data.clicks || 0
    };
  },

  generateTrendData(days) {
    const data = [];
    for (let i = 0; i < days; i++) {
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.floor(Math.random() * 100) + 50
      });
    }
    return data;
  }
};

module.exports = analyticsService;
