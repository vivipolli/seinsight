const express = require('express');
const router = express.Router();

const blockchainController = require('../controllers/blockchainController');

// Routes
router.get('/insights/:projectId', blockchainController.getInsightsFromChain);
router.get('/insights/:projectId/:insightId', blockchainController.getInsightFromChain);
router.post('/register-insight', blockchainController.registerInsightOnChain);
router.get('/contract-status', blockchainController.getContractStatus);

module.exports = router;
