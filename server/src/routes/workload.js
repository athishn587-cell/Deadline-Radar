const express = require('express');
const Task = require('../models/Task');
const { HttpError, asyncHandler } = require('../middleware/errorHandler');
const { isValidISO, mondayOf, todayISO } = require('../utils/dates');
const { computeWorkload } = require('../utils/workload');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const today = req.query.today ?? todayISO();
  if (!isValidISO(today)) throw new HttpError(400, 'today must be YYYY-MM-DD');
  const start = req.query.start ?? mondayOf(today);
  if (!isValidISO(start)) throw new HttpError(400, 'start must be YYYY-MM-DD');
  const capacity = req.query.capacity === undefined ? 6 : Number(req.query.capacity);
  if (!Number.isFinite(capacity) || capacity < 1 || capacity > 16) throw new HttpError(400, 'capacity must be between 1 and 16 hours');

  const tasks = await Task.find({ completed: false }).lean();
  res.json(computeWorkload(tasks, { start, capacity, today }));
}));

module.exports = router;
