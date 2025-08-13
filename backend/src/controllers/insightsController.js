const logger = require('../utils/logger');
const insightsService = require('../services/insightsService');
const blockchainService = require('../services/blockchainService');

const insightsController = {
  // Get all insights
  async getInsights(req, res) {
    try {
      const { page = 1, limit = 10, type, impact } = req.query;
      const insights = await insightsService.getInsights({ page, limit, type, impact });
      
      res.json({
        success: true,
        data: insights,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: insights.length
        }
      });
    } catch (error) {
      logger.error('Error getting insights:', error);
      res.status(500).json({ error: 'Failed to get insights' });
    }
  },

  // Get insights by project
  async getInsightsByProject(req, res) {
    try {
      const { projectId } = req.params;
      const { type, impact, status } = req.query;
      
      const insights = await insightsService.getInsightsByProject(projectId, { type, impact, status });
      
      res.json({
        success: true,
        data: insights,
        projectId
      });
    } catch (error) {
      logger.error('Error getting insights by project:', error);
      res.status(500).json({ error: 'Failed to get project insights' });
    }
  },

  // Get specific insight
  async getInsightById(req, res) {
    try {
      const { projectId, insightId } = req.params;
      const insight = await insightsService.getInsightById(projectId, insightId);
      
      if (!insight) {
        return res.status(404).json({ error: 'Insight not found' });
      }
      
      res.json({
        success: true,
        data: insight
      });
    } catch (error) {
      logger.error('Error getting insight by ID:', error);
      res.status(500).json({ error: 'Failed to get insight' });
    }
  },

  // Create new insight
  async createInsight(req, res) {
    try {
      const insightData = req.body;
      const insight = await insightsService.createInsight(insightData);
      
      res.status(201).json({
        success: true,
        data: insight,
        message: 'Insight created successfully'
      });
    } catch (error) {
      logger.error('Error creating insight:', error);
      res.status(500).json({ error: 'Failed to create insight' });
    }
  },

  // Approve/reject insight
  async approveInsight(req, res) {
    try {
      const { projectId, insightId, action, scheduledDate } = req.body;
      
      const result = await insightsService.approveInsight(projectId, insightId, action, scheduledDate);
      
      // If approved, register on blockchain
      if (action === 'approve') {
        await blockchainService.registerInsightOnChain(result.insight);
      }
      
      res.json({
        success: true,
        data: result,
        message: `Insight ${action}d successfully`
      });
    } catch (error) {
      logger.error('Error approving insight:', error);
      res.status(500).json({ error: 'Failed to approve insight' });
    }
  },

  // Get insights summary
  async getInsightsSummary(req, res) {
    try {
      const { projectId } = req.params;
      const summary = await insightsService.getInsightsSummary(projectId);
      
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      logger.error('Error getting insights summary:', error);
      res.status(500).json({ error: 'Failed to get insights summary' });
    }
  }
};

module.exports = insightsController;
