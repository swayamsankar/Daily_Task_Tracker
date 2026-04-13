const DailyScore = require('../models/DailyScore');
const Task = require('../models/Task');

// @route GET /api/analytics/performance?period=7|30
exports.getPerformance = async (req, res) => {
  try {
    const { period = '7' } = req.query;
    const days = parseInt(period);

    const scores = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const score = await DailyScore.findOne({ user: req.user._id, date: dateStr });
      scores.push({
        date: dateStr,
        score: score ? score.score : 0,
        totalTasks: score ? score.totalTasks : 0,
        completedTasks: score ? score.completedTasks : 0,
        allCompleted: score ? score.allCompleted : false
      });
    }

    // Weekly average
    const validScores = scores.filter(s => s.totalTasks > 0);
    const weeklyAvg = validScores.length > 0
      ? Math.round(validScores.reduce((sum, s) => sum + s.score, 0) / validScores.length)
      : 0;

    // Category allocation
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startStr = startDate.toISOString().split('T')[0];

    const tasks = await Task.find({
      user: req.user._id,
      date: { $gte: startStr }
    });

    const categoryCount = { Work: 0, Study: 0, Personal: 0, Health: 0 };
    tasks.forEach(t => { categoryCount[t.category] = (categoryCount[t.category] || 0) + 1; });
    const totalCatTasks = Object.values(categoryCount).reduce((a, b) => a + b, 0);
    const categoryAllocation = Object.entries(categoryCount).map(([name, count]) => ({
      name,
      percentage: totalCatTasks > 0 ? Math.round((count / totalCatTasks) * 100) : 0
    }));

    // Performance label
    let performanceLabel = 'Average';
    if (weeklyAvg >= 90) performanceLabel = 'Excellent';
    else if (weeklyAvg >= 75) performanceLabel = 'Good';
    else if (weeklyAvg >= 50) performanceLabel = 'Average';
    else performanceLabel = 'Needs Improvement';

    // Focus hours estimate (avg 1.5 hrs per completed task)
    const totalCompleted = validScores.reduce((sum, s) => sum + s.completedTasks, 0);
    const focusHours = Math.round(totalCompleted * 1.5);

    res.json({
      success: true,
      data: {
        scores,
        weeklyAvg,
        performanceLabel,
        focusHours,
        categoryAllocation,
        activeTasks: await Task.countDocuments({ user: req.user._id, completed: false }),
        consistency: validScores.length >= days * 0.7 ? 'High' : validScores.length >= days * 0.4 ? 'Medium' : 'Low',
        volatility: weeklyAvg >= 70 ? 'Low' : 'High'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
