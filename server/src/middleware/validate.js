const { HttpError } = require('./errorHandler');
const { isValidISO } = require('../utils/dates');
const TYPES = ['assignment', 'quiz', 'exam', 'project'];

// Validates and sanitises a task payload; result is placed on req.validated.
function validateTask(req, res, next) {
  const b = req.body || {};
  const errors = [];
  const out = {};

  if (typeof b.title !== 'string' || !b.title.trim()) errors.push('title is required');
  else if (b.title.trim().length > 120) errors.push('title must be at most 120 characters');
  else out.title = b.title.trim();

  if (b.course !== undefined && b.course !== '') {
    if (typeof b.course !== 'string' || b.course.trim().length > 60) errors.push('course must be text up to 60 characters');
    else out.course = b.course.trim();
  } else out.course = '';

  if (!TYPES.includes(b.type)) errors.push(`type must be one of: ${TYPES.join(', ')}`);
  else out.type = b.type;

  if (!isValidISO(b.dueDate)) errors.push('dueDate must be a real date in YYYY-MM-DD format');
  else out.dueDate = b.dueDate;

  const hrs = Number(b.estimatedHours);
  if (b.estimatedHours === undefined || b.estimatedHours === '' || !Number.isFinite(hrs) || hrs < 0.25 || hrs > 100)
    errors.push('estimatedHours must be a number between 0.25 and 100');
  else out.estimatedHours = hrs;

  if (b.notes !== undefined && b.notes !== '') {
    if (typeof b.notes !== 'string' || b.notes.length > 500) errors.push('notes must be text up to 500 characters');
    else out.notes = b.notes.trim();
  } else out.notes = '';

  if (errors.length) return next(new HttpError(400, 'Validation failed', errors));
  req.validated = out;
  next();
}

module.exports = { validateTask };
