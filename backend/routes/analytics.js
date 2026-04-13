const express = require('express');
const router = express.Router();
const { getPerformance } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/performance', getPerformance);

module.exports = router;
