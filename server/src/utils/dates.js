// All dates are plain 'YYYY-MM-DD' strings handled in UTC to avoid timezone drift.
const isValidISO = (s) => {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};
const toDate = (s) => new Date(s + 'T00:00:00Z');
const toISO = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = toDate(s); d.setUTCDate(d.getUTCDate() + n); return toISO(d); };
const diffDays = (a, b) => Math.round((toDate(a) - toDate(b)) / 86400000); // a - b
const mondayOf = (s) => addDays(s, -((toDate(s).getUTCDay() + 6) % 7));
const todayISO = () => toISO(new Date());

module.exports = { isValidISO, addDays, diffDays, mondayOf, todayISO };
