const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['Work', 'Study', 'Personal', 'Health'],
    default: 'Work'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  dueDate: {
    type: Date,
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format for easy querying
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
taskSchema.index({ user: 1, date: 1 });
taskSchema.index({ user: 1, completed: 1 });

module.exports = mongoose.model('Task', taskSchema);
