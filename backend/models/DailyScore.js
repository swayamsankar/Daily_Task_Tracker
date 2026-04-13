const mongoose = require('mongoose');

const dailyScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  totalTasks: {
    type: Number,
    default: 0
  },
  completedTasks: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  allCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

dailyScoreSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyScore', dailyScoreSchema);
