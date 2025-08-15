const logger = require('../utils/logger');
const aiService = require('./aiService');
const apifyService = require('./apifyService');
const {
  generateWorkflowId,
  extractAllComments,
  generateFinalInsights
} = require('../utils/insightUtils');

const insightService = {
  // Main workflow: Business Report → Hashtags → Social Data → AI Analysis → Insights
  async generateInsightsFromReport(businessReport, options = {}) {
    try {
      logger.info('Starting insight generation workflow from business report');
      
      const workflowId = generateWorkflowId();
      const startTime = Date.now();
      
      // Step 1: Generate hashtags from business report using AI
      logger.info('Step 1: Generating hashtags from business report');
      const hashtagResult = await aiService.generateHashtagsFromReport(businessReport);
      
      if (!hashtagResult.success) {
        throw new Error(`Failed to generate hashtags: ${hashtagResult.error}`);
      }
      
      const hashtags = hashtagResult.hashtags;
      logger.info(`Generated ${hashtags.length} hashtags: ${hashtags.join(', ')}`);
      
      // Step 2: Collect social media data for each hashtag
      logger.info('Step 2: Collecting social media data');
      const socialDataResult = await this.collectSocialData(hashtags, options);
      
      if (!socialDataResult.success) {
        throw new Error(`Failed to collect social data: ${socialDataResult.error}`);
      }
      
      // Step 3: Extract comments from social media posts
      logger.info('Step 3: Extracting comments from social media posts');
      const allComments = extractAllComments(socialDataResult.data, apifyService);
      
      // Step 4: Analyze comments using AI
      logger.info('Step 4: Analyzing comments with AI');
      const analysisResult = await aiService.analyzeSocialComments(allComments);
      
      if (!analysisResult.success) {
        throw new Error(`Failed to analyze comments: ${analysisResult.error}`);
      }
      
      // Step 5: Generate final insights
      logger.info('Step 5: Generating final insights');
      const finalInsights = generateFinalInsights({
        businessReport,
        hashtagResult,
        socialDataResult,
        analysisResult,
        workflowId,
        executionTime: Date.now() - startTime
      });
      
      logger.info('Insight generation workflow completed successfully');
      
      return {
        success: true,
        insights: finalInsights,
        metadata: {
          workflowId,
          executionTime: Date.now() - startTime,
          hashtagsAnalyzed: hashtags.length,
          postsCollected: socialDataResult.summary.totalPosts,
          commentsAnalyzed: allComments.length
        }
      };
      
    } catch (error) {
      logger.error('Error in insight generation workflow:', error);
      return {
        success: false,
        error: error.message,
        metadata: {
          workflowId: generateWorkflowId(),
          executionTime: Date.now() - startTime,
          step: 'unknown'
        }
      };
    }
  },

  // Collect social media data for hashtags
  async collectSocialData(hashtags, options = {}) {
    try {
      logger.info(`Collecting social data for ${hashtags.length} hashtags`);
      
      // Use mock data for MVP (replace with real Apify calls in production)
      const useMockData = process.env.USE_MOCK_DATA === 'true' || !process.env.APIFY_TOKEN;
      
      if (useMockData) {
        logger.info('Using mock data for social media collection');
        return await this.collectMockSocialData(hashtags, options);
      } else {
        logger.info('Using real Apify API for social media collection');
        return await apifyService.runMultipleHashtags(hashtags, options);
      }
      
    } catch (error) {
      logger.error('Error collecting social data:', error);
      return {
        success: false,
        error: error.message,
        data: [],
        summary: {
          totalHashtags: hashtags.length,
          successfulRuns: 0,
          failedRuns: hashtags.length,
          totalPosts: 0
        }
      };
    }
  },

  // Collect mock social data for testing
  async collectMockSocialData(hashtags, options = {}) {
    const results = [];
    
    for (const hashtag of hashtags) {
      try {
        const mockData = await apifyService.getMockInstagramData(hashtag);
        results.push(mockData);
        
        // Add delay between requests to simulate real API behavior
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        logger.error(`Error collecting mock data for ${hashtag}:`, error);
        results.push({
          success: false,
          hashtag,
          error: error.message,
          data: []
        });
      }
    }
    
    return {
      success: true,
      results,
      data: results.filter(r => r.success).flatMap(r => r.data),
      summary: {
        totalHashtags: hashtags.length,
        successfulRuns: results.filter(r => r.success).length,
        failedRuns: results.filter(r => !r.success).length,
        totalPosts: results.reduce((sum, r) => sum + (r.data?.length || 0), 0)
      }
    };
  },



  // Schedule recurring insight generation
  async scheduleInsightGeneration(userId, schedule) {
    try {
      logger.info(`Scheduling insight generation for user ${userId}`);
      
      // Store schedule in database (mock for MVP)
      const scheduleId = generateWorkflowId();
      
      return {
        success: true,
        scheduleId,
        schedule: {
          userId,
          frequency: schedule.frequency || 'weekly',
          dayOfWeek: schedule.dayOfWeek || 'monday',
          time: schedule.time || '09:00',
          enabled: true
        }
      };
      
    } catch (error) {
      logger.error('Error scheduling insight generation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get insight generation history
  async getInsightHistory(userId, limit = 10) {
    try {
      logger.info(`Getting insight history for user ${userId}`);
      
      // Mock history data (replace with database query in production)
      const history = [
        {
          id: 'insight_1',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          hashtagsAnalyzed: 8,
          postsCollected: 150,
          insightsGenerated: 5,
          status: 'completed'
        },
        {
          id: 'insight_2',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          hashtagsAnalyzed: 6,
          postsCollected: 120,
          insightsGenerated: 4,
          status: 'completed'
        }
      ];
      
      return {
        success: true,
        history: history.slice(0, limit)
      };
      
    } catch (error) {
      logger.error('Error getting insight history:', error);
      return {
        success: false,
        error: error.message,
        history: []
      };
    }
  }
};

module.exports = insightService;
