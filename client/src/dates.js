export const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
export const mondayOf = (s) => addDays(s, -((parse(s).getDay() + 6) % 7));
export const fmt = (s, opts = { day: 'numeric', month: 'short' }) => parse(s).toLocaleDateString(undefined, opts);
export const dayName = (s) => parse(s).toLocaleDateString(undefined, { weekday: 'short' });
