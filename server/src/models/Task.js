const mongoose = require('mongoose');

const TYPES = ['assignment', 'quiz', 'exam', 'project'];

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    course: { type: String, trim: true, maxlength: 60, default: '' },
    type: { type: String, enum: TYPES, required: true },
    dueDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ }, // YYYY-MM-DD
    estimatedHours: { type: Number, required: true, min: 0.25, max: 100 },
    notes: { type: String, trim: true, maxlength: 500, default: '' },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

taskSchema.index({ dueDate: 1, completed: 1 });

module.exports = mongoose.model('Task', taskSchema);
module.exports.TYPES = TYPES;
