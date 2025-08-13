const express = require('express');
const router = express.Router();
const Joi = require('joi');

const socialController = require('../controllers/socialController');
const validateRequest = require('../middleware/validateRequest');

// Validation schemas
const collectDataSchema = Joi.object({
  projectId: Joi.string().required(),
  platforms: Joi.array().items(Joi.string().valid('twitter', 'linkedin', 'instagram')).required(),
  forceRefresh: Joi.boolean().default(false)
});

const configurePlatformSchema = Joi.object({
  projectId: Joi.string().required(),
  platform: Joi.string().valid('twitter', 'linkedin', 'instagram').required(),
  credentials: Joi.object().required()
});

// Routes
router.post('/collect', validateRequest(collectDataSchema), socialController.collectSocialData);
router.post('/configure', validateRequest(configurePlatformSchema), socialController.configurePlatform);
router.get('/status/:projectId', socialController.getCollectionStatus);
router.get('/data/:projectId', socialController.getSocialData);
router.delete('/data/:projectId', socialController.clearSocialData);

module.exports = router;
