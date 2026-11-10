const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const { validateTask } = require('../middleware/validate');
const { HttpError, asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

const checkId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id) ? next() : next(new HttpError(400, 'Invalid task id'));

router.get('/', asyncHandler(async (req, res) => {
  const q = {};
  if (req.query.completed === 'true' || req.query.completed === 'false') q.completed = req.query.completed === 'true';
  if (req.query.type) q.type = String(req.query.type);
  res.json(await Task.find(q).sort({ dueDate: 1, createdAt: 1 }));
}));

router.post('/', validateTask, asyncHandler(async (req, res) => {
  res.status(201).json(await Task.create(req.validated));
}));

router.put('/:id', checkId, validateTask, asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.validated, { new: true, runValidators: true });
  if (!task) throw new HttpError(404, 'Task not found');
  res.json(task);
}));

router.patch('/:id/toggle', checkId, asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new HttpError(404, 'Task not found');
  task.completed = !task.completed;
  await task.save();
  res.json(task);
}));

router.delete('/:id', checkId, asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new HttpError(404, 'Task not found');
  res.status(204).end();
}));

module.exports = router;
