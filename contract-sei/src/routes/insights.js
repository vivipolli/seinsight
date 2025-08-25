const express = require('express');
const router = express.Router();
const insightController = require('../controllers/insightController');
const validateRequest = require('../middleware/validateRequest');
const Joi = require('joi');

// Validation schemas
const generateInsightsSchema = Joi.object({
  businessReport: Joi.string().required().min(10).max(5000),
  options: Joi.object({
    resultsLimit: Joi.number().integer().min(10).max(500).default(180),
    onlyPostsNewerThan: Joi.string().valid('1 day', '1 week', '1 month').default('1 week'),
    maxConcurrent: Joi.number().integer().min(1).max(10).default(3),
    delayBetweenRuns: Joi.number().integer().min(1000).max(10000).default(2000)
  }).optional()
});

const scheduleInsightsSchema = Joi.object({
  userId: Joi.string().required(),
  schedule: Joi.object({
    frequency: Joi.string().valid('daily', 'weekly', 'monthly').default('weekly'),
    dayOfWeek: Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday').when('frequency', {
      is: 'weekly',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('09:00'),
    enabled: Joi.boolean().default(true)
  }).required()
});

// Routes
router.post('/generate', validateRequest(generateInsightsSchema), insightController.generateInsights);
router.post('/schedule', validateRequest(scheduleInsightsSchema), insightController.scheduleInsights);
router.get('/history/:userId', insightController.getInsightHistory);
router.get('/stats/:userId', insightController.getInsightStats);
router.get('/:insightId', insightController.getInsightById);

module.exports = router;
