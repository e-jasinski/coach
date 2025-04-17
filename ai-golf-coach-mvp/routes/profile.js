const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileCtrl = require('../controllers/profileController');

router.get('/',             auth, profileCtrl.getProfile);
router.put('/',             auth, profileCtrl.upsertProfile);

module.exports = router;
