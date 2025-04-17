const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const aiCoachCtrl = require('../controllers/aiCoachController');

router.get('/recommendations', auth, aiCoachCtrl.getRecommendations);

module.exports = router; 