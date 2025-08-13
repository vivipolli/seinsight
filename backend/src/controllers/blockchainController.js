const logger = require('../utils/logger');
const blockchainService = require('../services/blockchainService');

const blockchainController = {
  // Get insights from blockchain
  async getInsightsFromChain(req, res) {
    try {
      const { projectId } = req.params;
      
      const insights = await blockchainService.getInsightsFromChain(projectId);
      
      res.json({
        success: true,
        data: insights,
        projectId
      });
    } catch (error) {
      logger.error('Error getting insights from chain:', error);
      res.status(500).json({ error: 'Failed to get insights from blockchain' });
    }
  },

  // Get specific insight from blockchain
  async getInsightFromChain(req, res) {
    try {
      const { projectId, insightId } = req.params;
      
      const insight = await blockchainService.getInsightFromChain(projectId, insightId);
      
      if (!insight) {
        return res.status(404).json({ error: 'Insight not found on blockchain' });
      }
      
      res.json({
        success: true,
        data: insight
      });
    } catch (error) {
      logger.error('Error getting insight from chain:', error);
      res.status(500).json({ error: 'Failed to get insight from blockchain' });
    }
  },

  // Register insight on blockchain
  async registerInsightOnChain(req, res) {
    try {
      const { projectId, insightType, payloadHash, uri } = req.body;
      
      const result = await blockchainService.registerInsightOnChain({
        projectId,
        insightType,
        payloadHash,
        uri
      });
      
      res.json({
        success: true,
        data: result,
        message: 'Insight registered on blockchain successfully'
      });
    } catch (error) {
      logger.error('Error registering insight on chain:', error);
      res.status(500).json({ error: 'Failed to register insight on blockchain' });
    }
  },

  // Get contract status
  async getContractStatus(req, res) {
    try {
      const status = await blockchainService.getContractStatus();
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      logger.error('Error getting contract status:', error);
      res.status(500).json({ error: 'Failed to get contract status' });
    }
  }
};

module.exports = blockchainController;
