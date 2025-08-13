const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const logger = require('../utils/logger');

// Mock database for MVP
const insightsDB = new Map();

const insightsService = {
  // Get all insights with filters
  async getInsights(filters = {}) {
    try {
      const { page = 1, limit = 10, type, impact } = filters;
      let insights = Array.from(insightsDB.values());
      
      // Apply filters
      if (type) {
        insights = insights.filter(insight => insight.insightType === type);
      }
      if (impact) {
        insights = insights.filter(insight => insight.impact === impact);
      }
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedInsights = insights.slice(startIndex, endIndex);
      
      return paginatedInsights;
    } catch (error) {
      logger.error('Error getting insights:', error);
      throw error;
    }
  },

  // Get insights by project
  async getInsightsByProject(projectId, filters = {}) {
    try {
      const { type, impact, status } = filters;
      let insights = Array.from(insightsDB.values())
        .filter(insight => insight.projectId === projectId);
      
      // Apply filters
      if (type) {
        insights = insights.filter(insight => insight.insightType === type);
      }
      if (impact) {
        insights = insights.filter(insight => insight.impact === impact);
      }
      if (status) {
        insights = insights.filter(insight => insight.status === status);
      }
      
      return insights.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      logger.error('Error getting insights by project:', error);
      throw error;
    }
  },

  // Get specific insight
  async getInsightById(projectId, insightId) {
    try {
      const insight = insightsDB.get(insightId);
      if (insight && insight.projectId === projectId) {
        return insight;
      }
      return null;
    } catch (error) {
      logger.error('Error getting insight by ID:', error);
      throw error;
    }
  },

  // Create new insight
  async createInsight(insightData) {
    try {
      const insightId = uuidv4();
      const timestamp = Date.now();
      
      const insight = {
        insightId,
        projectId: insightData.projectId,
        insightType: insightData.insightType,
        evidence: insightData.evidence,
        recommendation: insightData.recommendation,
        confidence: insightData.confidence,
        impact: insightData.impact,
        status: 'pending',
        createdAt: timestamp,
        updatedAt: timestamp,
        payloadHash: null,
        uri: null
      };
      
      insightsDB.set(insightId, insight);
      
      logger.info(`Insight created: ${insightId} for project: ${insightData.projectId}`);
      
      return insight;
    } catch (error) {
      logger.error('Error creating insight:', error);
      throw error;
    }
  },

  // Approve/reject insight
  async approveInsight(projectId, insightId, action, scheduledDate = null) {
    try {
      const insight = insightsDB.get(insightId);
      
      if (!insight || insight.projectId !== projectId) {
        throw new Error('Insight not found');
      }
      
      insight.status = action;
      insight.updatedAt = Date.now();
      
      if (action === 'schedule' && scheduledDate) {
        insight.scheduledDate = scheduledDate;
      }
      
      if (action === 'approve') {
        // Generate payload hash for blockchain
        const payload = JSON.stringify({
          projectId: insight.projectId,
          insightType: insight.insightType,
          evidence: insight.evidence,
          recommendation: insight.recommendation,
          confidence: insight.confidence,
          impact: insight.impact
        });
        
        insight.payloadHash = crypto.createHash('sha256').update(payload).digest('hex');
        insight.uri = `ipfs://${insight.payloadHash}`; // Mock IPFS URI
      }
      
      insightsDB.set(insightId, insight);
      
      logger.info(`Insight ${action}d: ${insightId}`);
      
      return {
        insight,
        action,
        timestamp: Date.now()
      };
    } catch (error) {
      logger.error('Error approving insight:', error);
      throw error;
    }
  },

  // Get insights summary
  async getInsightsSummary(projectId) {
    try {
      const insights = Array.from(insightsDB.values())
        .filter(insight => insight.projectId === projectId);
      
      const summary = {
        total: insights.length,
        byStatus: {
          pending: insights.filter(i => i.status === 'pending').length,
          approved: insights.filter(i => i.status === 'approve').length,
          rejected: insights.filter(i => i.status === 'reject').length,
          scheduled: insights.filter(i => i.status === 'schedule').length
        },
        byType: {},
        byImpact: {
          low: insights.filter(i => i.impact === 'low').length,
          medium: insights.filter(i => i.impact === 'medium').length,
          high: insights.filter(i => i.impact === 'high').length
        },
        averageConfidence: insights.length > 0 
          ? insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length 
          : 0
      };
      
      // Count by type
      insights.forEach(insight => {
        summary.byType[insight.insightType] = (summary.byType[insight.insightType] || 0) + 1;
      });
      
      return summary;
    } catch (error) {
      logger.error('Error getting insights summary:', error);
      throw error;
    }
  }
};

module.exports = insightsService;
