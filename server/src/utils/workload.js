const { addDays, diffDays } = require('./dates');

const LEAD_DAYS = { assignment: 3, quiz: 2, exam: 5, project: 7 };
const WEIGHT = { assignment: 1.0, quiz: 1.1, exam: 1.3, project: 1.15 };

// Spread one task's effort over the days before its due date, ramping up toward the deadline.
function spreadTask(task, today) {
  if (task.completed) return [];
  const lead = LEAD_DAYS[task.type] || 3;
  const total = task.estimatedHours * (WEIGHT[task.type] || 1);
  let start = addDays(task.dueDate, -(lead - 1));
  if (diffDays(start, today) < 0) start = today;            // cannot plan in the past
  if (diffDays(task.dueDate, start) < 0) return [{ date: today, hours: total }]; // overdue: pile onto today
  const n = diffDays(task.dueDate, start) + 1;
  const sum = (n * (n + 1)) / 2;                             // weights 1..n
  return Array.from({ length: n }, (_, i) => ({ date: addDays(start, i), hours: (total * (i + 1)) / sum }));
}

const levelFor = (score) => (score >= 100 ? 'overloaded' : score >= 80 ? 'heavy' : score >= 50 ? 'steady' : 'light');
const round = (n) => Math.round(n * 100) / 100;

function computeWorkload(tasks, { start, capacity = 6, today }) {
  const byDay = {};
  for (const t of tasks) {
    const key = String(t._id ?? t.title);
    for (const { date, hours } of spreadTask(t, today)) {
      const d = (byDay[date] ||= { hours: 0, tasks: new Map() });
      d.hours += hours;
      const entry = d.tasks.get(key) || { id: String(t._id ?? ''), title: t.title, type: t.type, course: t.course, hours: 0 };
      entry.hours += hours;
      d.tasks.set(key, entry);
    }
  }
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    const d = byDay[date];
    const load = d ? d.hours : 0;
    return {
      date,
      load: round(load),
      percentOfCapacity: Math.round((load / capacity) * 100),
      overloaded: load > capacity,
      tasks: d ? [...d.tasks.values()].map((x) => ({ ...x, hours: round(x.hours) })).sort((a, b) => b.hours - a.hours) : [],
      dueToday: tasks.filter((t) => !t.completed && t.dueDate === date).map((t) => ({ id: String(t._id ?? ''), title: t.title, type: t.type })),
    };
  });
  const totalLoad = days.reduce((s, d) => s + d.load, 0);
  const score = Math.round((totalLoad / (capacity * 7)) * 100);
  return {
    start, end: addDays(start, 6), capacity,
    totalLoad: round(totalLoad), score, level: levelFor(score),
    overloadedDays: days.filter((d) => d.overloaded).map((d) => d.date),
    peakDay: days.reduce((a, b) => (b.load > a.load ? b : a), days[0]).date,
    days,
  };
}

module.exports = { computeWorkload, spreadTask, levelFor };
