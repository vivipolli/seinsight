const logger = require('../utils/logger');
const socialService = require('../services/socialService');

const socialController = {
  // Collect social data
  async collectSocialData(req, res) {
    try {
      const { projectId, platforms, forceRefresh } = req.body;
      
      const result = await socialService.collectSocialData(projectId, platforms, forceRefresh);
      
      res.json({
        success: true,
        data: result,
        message: 'Social data collection initiated'
      });
    } catch (error) {
      logger.error('Error collecting social data:', error);
      res.status(500).json({ error: 'Failed to collect social data' });
    }
  },

  // Configure platform
  async configurePlatform(req, res) {
    try {
      const { projectId, platform, credentials } = req.body;
      
      const result = await socialService.configurePlatform(projectId, platform, credentials);
      
      res.json({
        success: true,
        data: result,
        message: 'Platform configured successfully'
      });
    } catch (error) {
      logger.error('Error configuring platform:', error);
      res.status(500).json({ error: 'Failed to configure platform' });
    }
  },

  // Get collection status
  async getCollectionStatus(req, res) {
    try {
      const { projectId } = req.params;
      
      const status = await socialService.getCollectionStatus(projectId);
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      logger.error('Error getting collection status:', error);
      res.status(500).json({ error: 'Failed to get collection status' });
    }
  },

  // Get social data
  async getSocialData(req, res) {
    try {
      const { projectId } = req.params;
      const { platform, period = '7d' } = req.query;
      
      const data = await socialService.getSocialData(projectId, platform, period);
      
      res.json({
        success: true,
        data: data,
        projectId,
        platform,
        period
      });
    } catch (error) {
      logger.error('Error getting social data:', error);
      res.status(500).json({ error: 'Failed to get social data' });
    }
  },

  // Clear social data
  async clearSocialData(req, res) {
    try {
      const { projectId } = req.params;
      
      await socialService.clearSocialData(projectId);
      
      res.json({
        success: true,
        message: 'Social data cleared successfully'
      });
    } catch (error) {
      logger.error('Error clearing social data:', error);
      res.status(500).json({ error: 'Failed to clear social data' });
    }
  }
};

module.exports = socialController;
