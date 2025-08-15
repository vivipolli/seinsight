const logger = require('../utils/logger');
const insightService = require('../services/insightService');

const insightController = {
  // Generate insights from business report
  async generateInsights(req, res) {
    try {
      const { businessReport, options = {} } = req.body;
      
      if (!businessReport) {
        return res.status(400).json({
          success: false,
          error: 'Business report is required'
        });
      }
      
      logger.info('Generating insights from business report');
      
      const result = await insightService.generateInsightsFromReport(businessReport, options);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.insights,
          metadata: result.metadata,
          message: 'Insights generated successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          metadata: result.metadata
        });
      }
      
    } catch (error) {
      logger.error('Error generating insights:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate insights'
      });
    }
  },

  // Schedule recurring insight generation
  async scheduleInsights(req, res) {
    try {
      const { userId, schedule } = req.body;
      
      if (!userId || !schedule) {
        return res.status(400).json({
          success: false,
          error: 'User ID and schedule are required'
        });
      }
      
      logger.info(`Scheduling insights for user ${userId}`);
      
      const result = await insightService.scheduleInsightGeneration(userId, schedule);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.schedule,
          scheduleId: result.scheduleId,
          message: 'Insight generation scheduled successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error
        });
      }
      
    } catch (error) {
      logger.error('Error scheduling insights:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to schedule insights'
      });
    }
  },

  // Get insight generation history
  async getInsightHistory(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 10 } = req.query;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }
      
      logger.info(`Getting insight history for user ${userId}`);
      
      const result = await insightService.getInsightHistory(userId, parseInt(limit));
      
      if (result.success) {
        res.json({
          success: true,
          data: result.history,
          message: 'Insight history retrieved successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error
        });
      }
      
    } catch (error) {
      logger.error('Error getting insight history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get insight history'
      });
    }
  },

  // Get insight by ID
  async getInsightById(req, res) {
    try {
      const { insightId } = req.params;
      
      if (!insightId) {
        return res.status(400).json({
          success: false,
          error: 'Insight ID is required'
        });
      }
      
      logger.info(`Getting insight ${insightId}`);
      
      // Mock insight data (replace with database query in production)
      const mockInsight = {
        id: insightId,
        timestamp: new Date().toISOString(),
        businessReport: {
          summary: {
            wordCount: 150,
            sentenceCount: 8,
            keyThemes: ['Growth', 'Marketing'],
            sentiment: 'positive'
          }
        },
        hashtags: {
          generated: ['growthhacking', 'startup', 'marketing'],
          reasoning: [
            { hashtag: 'growthhacking', reasoning: 'Relevant for rapid growth strategies' },
            { hashtag: 'startup', reasoning: 'Appropriate for startup challenges' },
            { hashtag: 'marketing', reasoning: 'Essential for marketing discussions' }
          ],
          confidence: 0.85
        },
        socialMedia: {
          postsCollected: 45,
          commentsAnalyzed: 120,
          engagement: {
            totalLikes: 850,
            totalComments: 120,
            totalShares: 45,
            averageEngagement: 22.5
          },
          topTopics: [
            { topic: 'growth', count: 15 },
            { topic: 'business', count: 12 },
            { topic: 'marketing', count: 10 }
          ]
        },
        sentiment: {
          overall: 'positive',
          breakdown: {
            positive: 85,
            negative: 10,
            neutral: 25
          },
          trends: [
            {
              type: 'engagement',
              description: 'High engagement on growth-related content',
              confidence: 0.8
            }
          ]
        },
        insights: {
          summary: {
            overallSentiment: 'positive',
            topTopic: 'growth',
            mainTrend: 'High engagement on growth-related content',
            keyRecommendation: 'Focus on growth hacking content as it generates high engagement',
            engagementScore: 22.5
          },
          recommendations: [
            {
              type: 'content',
              suggestion: 'Focus on growth hacking content as it generates high engagement',
              priority: 'high'
            }
          ],
          opportunities: [
            {
              type: 'engagement',
              description: 'High engagement detected - consider creating more similar content',
              priority: 'high',
              confidence: 0.8
            }
          ]
        },
        actionItems: [
          {
            type: 'content',
            action: 'Create content around trending topics',
            description: 'Focus on: growth, business, marketing',
            priority: 'high',
            timeline: '1 week'
          }
        ],
        performance: {
          hashtagPerformance: {
            growthhacking: { posts: 15, engagement: 25.3, success: true },
            startup: { posts: 18, engagement: 20.1, success: true },
            marketing: { posts: 12, engagement: 18.7, success: true }
          },
          engagementScore: 22.5,
          reachEstimate: 45000
        }
      };
      
      res.json({
        success: true,
        data: mockInsight,
        message: 'Insight retrieved successfully'
      });
      
    } catch (error) {
      logger.error('Error getting insight by ID:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get insight'
      });
    }
  },

  // Get insight statistics
  async getInsightStats(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }
      
      logger.info(`Getting insight stats for user ${userId}`);
      
      // Mock statistics (replace with database aggregation in production)
      const stats = {
        totalInsights: 24,
        averageExecutionTime: 45000, // milliseconds
        totalHashtagsAnalyzed: 180,
        totalPostsCollected: 3600,
        totalCommentsAnalyzed: 12000,
        averageEngagementScore: 18.5,
        topPerformingHashtags: [
          { hashtag: 'growthhacking', engagement: 25.3 },
          { hashtag: 'startup', engagement: 20.1 },
          { hashtag: 'marketing', engagement: 18.7 }
        ],
        sentimentDistribution: {
          positive: 65,
          negative: 15,
          neutral: 20
        },
        monthlyTrend: [
          { month: 'Jan', insights: 2, engagement: 15.2 },
          { month: 'Feb', insights: 4, engagement: 16.8 },
          { month: 'Mar', insights: 6, engagement: 18.1 },
          { month: 'Apr', insights: 8, engagement: 19.3 },
          { month: 'May', insights: 4, engagement: 18.5 }
        ]
      };
      
      res.json({
        success: true,
        data: stats,
        message: 'Insight statistics retrieved successfully'
      });
      
    } catch (error) {
      logger.error('Error getting insight stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get insight statistics'
      });
    }
  }
};

module.exports = insightController;
