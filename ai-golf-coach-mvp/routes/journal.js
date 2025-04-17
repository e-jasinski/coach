const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const journalController = require('../controllers/journalController');

// All routes require auth
router.post('/', authMiddleware, journalController.createEntry);
router.get('/', authMiddleware, journalController.getEntries);
router.get('/:id', authMiddleware, journalController.getEntry);
router.put('/:id', authMiddleware, journalController.updateEntry);
router.delete('/:id', authMiddleware, journalController.deleteEntry);

module.exports = router;
