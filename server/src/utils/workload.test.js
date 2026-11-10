const test = require('node:test');
const assert = require('node:assert');
const { computeWorkload } = require('./workload');

test('exam + quiz cluster flags the deadline day as overloaded', () => {
  const tasks = [
    { _id: 'a', title: 'Exam', type: 'exam', dueDate: '2026-11-13', estimatedHours: 20, completed: false },
    { _id: 'b', title: 'Quiz', type: 'quiz', dueDate: '2026-11-13', estimatedHours: 8, completed: false },
  ];
  const w = computeWorkload(tasks, { start: '2026-11-09', capacity: 6, today: '2026-11-09' });
  assert.ok(w.totalLoad > 30);
  assert.ok(w.days[4].overloaded);
});

test('completed tasks are ignored', () => {
  const w = computeWorkload(
    [{ _id: 'a', title: 'x', type: 'quiz', dueDate: '2026-11-12', estimatedHours: 5, completed: true }],
    { start: '2026-11-09', capacity: 6, today: '2026-11-09' }
  );
  assert.strictEqual(w.score, 0);
});
