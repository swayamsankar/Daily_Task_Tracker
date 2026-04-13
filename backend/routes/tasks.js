const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, getTodayStats } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/today/stats', getTodayStats);

module.exports = router;
