const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const aiCoachCtrl = require('../controllers/aiCoachController');

// POST to generate a new recommendation based on specific inputs
router.post('/generate', auth, aiCoachCtrl.generateRecommendation);

// GET to retrieve historical recommendations
router.get('/history', auth, aiCoachCtrl.getRecommendationHistory);

// GET the latest recommendation for dashboard
router.get('/latest', auth, aiCoachCtrl.getLatestRecommendation);

module.exports = router; 