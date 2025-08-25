const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analyticsController');

// Routes
router.get('/social/:projectId', analyticsController.getSocialAnalytics);
router.get('/social/:projectId/sentiment', analyticsController.getSentimentAnalysis);
router.get('/social/:projectId/trends', analyticsController.getTrendAnalysis);
router.get('/social/:projectId/engagement', analyticsController.getEngagementMetrics);
router.get('/social/:projectId/benchmarks', analyticsController.getBenchmarks);

module.exports = router;
