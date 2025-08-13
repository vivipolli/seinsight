const express = require('express');
const router = express.Router();
const Joi = require('joi');

const insightsController = require('../controllers/insightsController');
const validateRequest = require('../middleware/validateRequest');

// Validation schemas
const approveInsightSchema = Joi.object({
  projectId: Joi.string().required(),
  insightId: Joi.string().required(),
  action: Joi.string().valid('approve', 'reject', 'schedule').required(),
  scheduledDate: Joi.date().when('action', {
    is: 'schedule',
    then: Joi.required()
  })
});

const createInsightSchema = Joi.object({
  projectId: Joi.string().required(),
  insightType: Joi.string().required(),
  evidence: Joi.array().items(Joi.string()).required(),
  recommendation: Joi.string().required(),
  confidence: Joi.number().min(0).max(1).required(),
  impact: Joi.string().valid('low', 'medium', 'high').required()
});

// Routes
router.get('/', insightsController.getInsights);
router.get('/:projectId', insightsController.getInsightsByProject);
router.get('/:projectId/:insightId', insightsController.getInsightById);
router.post('/', validateRequest(createInsightSchema), insightsController.createInsight);
router.post('/approve', validateRequest(approveInsightSchema), insightsController.approveInsight);
router.get('/:projectId/analytics/summary', insightsController.getInsightsSummary);

module.exports = router;
