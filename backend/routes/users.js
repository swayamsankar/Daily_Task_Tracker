const express = require('express');
const router = express.Router();
const { updateProfile, updatePassword, uploadAvatar } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.put('/profile', uploadAvatar, updateProfile);
router.put('/password', updatePassword);

module.exports = router;
