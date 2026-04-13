const Task = require('../models/Task');
const DailyScore = require('../models/DailyScore');
const User = require('../models/User');

// Helper: calculate and save daily score
const updateDailyScore = async (userId, date) => {
  const tasks = await Task.find({ user: userId, date });
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const score = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const allCompleted = totalTasks > 0 && completedTasks === totalTasks;

  await DailyScore.findOneAndUpdate(
    { user: userId, date },
    { totalTasks, completedTasks, score, allCompleted },
    { upsert: true, new: true }
  );

  // Update streak
  if (allCompleted) {
    const user = await User.findById(userId);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const yesterdayScore = await DailyScore.findOne({ user: userId, date: yesterdayStr });
    
    let newStreak = 1;
    if (yesterdayScore && yesterdayScore.allCompleted) {
      newStreak = (user.currentStreak || 0) + 1;
    }

    const highestStreak = Math.max(newStreak, user.highestStreak || 0);
    await User.findByIdAndUpdate(userId, { 
      currentStreak: newStreak, 
      highestStreak,
      lastActiveDate: new Date()
    });
  }

  return { totalTasks, completedTasks, score };
};

// @route GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const { date, category, completed } = req.query;
    const query = { user: req.user._id };

    if (date) query.date = date;
    if (category) query.category = category;
    if (completed !== undefined) query.completed = completed === 'true';

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description, category, priority, dueDate } = req.body;
    const date = new Date(dueDate).toISOString().split('T')[0];

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      category,
      priority,
      dueDate,
      date
    });

    await updateDailyScore(req.user._id, date);

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const { title, description, category, priority, completed, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (category !== undefined) task.category = category;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) {
      task.dueDate = dueDate;
      task.date = new Date(dueDate).toISOString().split('T')[0];
    }
    if (completed !== undefined) {
      task.completed = completed;
      task.completedAt = completed ? new Date() : null;
      if (completed) {
        await User.findByIdAndUpdate(req.user._id, { $inc: { totalTasksCompleted: 1 } });
      } else {
        await User.findByIdAndUpdate(req.user._id, { $inc: { totalTasksCompleted: -1 } });
      }
    }

    await task.save();
    await updateDailyScore(req.user._id, task.date);

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const date = task.date;
    await task.deleteOne();
    await updateDailyScore(req.user._id, date);

    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/tasks/today
exports.getTodayStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const tasks = await Task.find({ user: req.user._id, date: today });
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const score = total > 0 ? Math.round((completed / total) * 100) : 0;

    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      stats: {
        totalTasks: total,
        completedTasks: completed,
        score,
        currentStreak: user.currentStreak,
        highestStreak: user.highestStreak
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
