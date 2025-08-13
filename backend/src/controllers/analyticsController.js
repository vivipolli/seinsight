const logger = require('../utils/logger');
const analyticsService = require('../services/analyticsService');

const analyticsController = {
  // Get social analytics overview
  async getSocialAnalytics(req, res) {
    try {
      const { projectId } = req.params;
      const { period = '7d' } = req.query;
      
      const analytics = await analyticsService.getSocialAnalytics(projectId, period);
      
      res.json({
        success: true,
        data: analytics,
        projectId,
        period
      });
    } catch (error) {
      logger.error('Error getting social analytics:', error);
      res.status(500).json({ error: 'Failed to get social analytics' });
    }
  },

  // Get sentiment analysis
  async getSentimentAnalysis(req, res) {
    try {
      const { projectId } = req.params;
      const { platform, period = '7d' } = req.query;
      
      const sentiment = await analyticsService.getSentimentAnalysis(projectId, platform, period);
      
      res.json({
        success: true,
        data: sentiment,
        projectId,
        platform,
        period
      });
    } catch (error) {
      logger.error('Error getting sentiment analysis:', error);
      res.status(500).json({ error: 'Failed to get sentiment analysis' });
    }
  },

  // Get trend analysis
  async getTrendAnalysis(req, res) {
    try {
      const { projectId } = req.params;
      const { platform, period = '30d' } = req.query;
      
      const trends = await analyticsService.getTrendAnalysis(projectId, platform, period);
      
      res.json({
        success: true,
        data: trends,
        projectId,
        platform,
        period
      });
    } catch (error) {
      logger.error('Error getting trend analysis:', error);
      res.status(500).json({ error: 'Failed to get trend analysis' });
    }
  },

  // Get engagement metrics
  async getEngagementMetrics(req, res) {
    try {
      const { projectId } = req.params;
      const { platform, period = '7d' } = req.query;
      
      const engagement = await analyticsService.getEngagementMetrics(projectId, platform, period);
      
      res.json({
        success: true,
        data: engagement,
        projectId,
        platform,
        period
      });
    } catch (error) {
      logger.error('Error getting engagement metrics:', error);
      res.status(500).json({ error: 'Failed to get engagement metrics' });
    }
  },

  // Get benchmarks
  async getBenchmarks(req, res) {
    try {
      const { projectId } = req.params;
      const { sector, platform } = req.query;
      
      const benchmarks = await analyticsService.getBenchmarks(projectId, sector, platform);
      
      res.json({
        success: true,
        data: benchmarks,
        projectId,
        sector,
        platform
      });
    } catch (error) {
      logger.error('Error getting benchmarks:', error);
      res.status(500).json({ error: 'Failed to get benchmarks' });
    }
  }
};

module.exports = analyticsController;
