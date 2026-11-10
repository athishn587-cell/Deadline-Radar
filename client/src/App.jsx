import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import { addDays, fmt, iso, mondayOf } from './dates.js';
import TaskForm from './components/TaskForm.jsx';
import WeekRadar from './components/WeekRadar.jsx';

const LEVEL_TEXT = { light: 'Light week', steady: 'Steady week', heavy: 'Heavy week', overloaded: 'Overloaded week' };
const today = iso(new Date());

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [wl, setWl] = useState(null);
  const [start, setStart] = useState(mondayOf(today));
  const [capacity, setCapacity] = useState(() => Number(localStorage.getItem('capacity')) || 6);
  const [selected, setSelected] = useState(today);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('open');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [t, w] = await Promise.all([api.listTasks(), api.workload({ start, capacity, today })]);
      setTasks(t); setWl(w); setError('');
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [start, capacity]);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { localStorage.setItem('capacity', capacity); }, [capacity]);

  const run = (fn) => async (...a) => { try { await fn(...a); await refresh(); } catch (e) { setError(e.message); } };
  const save = async (data) => {
    if (editing) await api.updateTask(editing._id, data); else await api.createTask(data);
    setEditing(null); await refresh();
  };
  const toggle = run((id) => api.toggleTask(id));
  const remove = run(async (id) => { if (window.confirm('Delete this deadline?')) await api.deleteTask(id); });

  const shown = tasks.filter((t) => (filter === 'all' ? true : filter === 'done' ? t.completed : !t.completed));
  const day = wl?.days.find((d) => d.date === selected);

  return (
    <div className="app">
      <header>
        <h1>Deadline Radar</h1>
        <p>See the weeks where quizzes, assignments and exams pile up before they do.</p>
      </header>

      {error && <div className="banner" role="alert"><span>{error}</span><button onClick={() => setError('')}>Dismiss</button></div>}

      <main>
        <section className="left">
          <div className="panel">
            <div className="week-head">
              <div className="nav">
                <button onClick={() => setStart(addDays(start, -7))} aria-label="Previous week">‹</button>
                <strong>{fmt(start)} – {fmt(addDays(start, 6))}</strong>
                <button onClick={() => setStart(addDays(start, 7))} aria-label="Next week">›</button>
                <button onClick={() => setStart(mondayOf(today))}>This week</button>
              </div>
              <label className="cap">Comfortable hours/day
                <input type="number" min="1" max="16" step="0.5" value={capacity}
                  onChange={(e) => setCapacity(Math.min(16, Math.max(1, Number(e.target.value) || 6)))} />
              </label>
            </div>

            {loading ? <p className="muted">Loading…</p> : wl && (
              <>
                <div className={`score ${wl.level}`}>
                  <div className="num">{wl.score}<small>%</small></div>
                  <div>
                    <strong>{LEVEL_TEXT[wl.level]}</strong>
                    <p>{wl.totalLoad}h of effort against {capacity * 7}h capacity.{' '}
                      {wl.overloadedDays.length
                        ? `${wl.overloadedDays.length} overloaded day${wl.overloadedDays.length > 1 ? 's' : ''}: ${wl.overloadedDays.map((d) => fmt(d, { weekday: 'short', day: 'numeric' })).join(', ')}.`
                        : 'No overloaded days.'}
                    </p>
                  </div>
                </div>
                <WeekRadar data={wl} selected={selected} onSelect={setSelected} />
                {day && (
                  <div className="day-detail">
                    <h3>{fmt(day.date, { weekday: 'long', day: 'numeric', month: 'long' })}: {day.load}h {day.overloaded && <span className="tag over">Overloaded</span>}</h3>
                    {day.tasks.length === 0
                      ? <p className="muted">Nothing scheduled. A good day to get ahead.</p>
                      : <ul>{day.tasks.map((t) => <li key={t.id}><span className={`dot ${t.type}`} />{t.title}{t.course && ` (${t.course})`}<b>{t.hours}h</b></li>)}</ul>}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="panel">
            <div className="list-head">
              <h2>Deadlines</h2>
              <div className="seg">{['open', 'done', 'all'].map((f) => <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div>
            </div>
            {shown.length === 0 ? <p className="muted">No deadlines here yet. Add one to see its effect on your week.</p> : (
              <ul className="tasks">
                {shown.map((t) => (
                  <li key={t._id} className={t.completed ? 'done' : ''}>
                    <input type="checkbox" checked={t.completed} onChange={() => toggle(t._id)} aria-label={`Mark ${t.title} complete`} />
                    <div className="info">
                      <strong>{t.title}</strong>
                      <span><i className={`dot ${t.type}`} />{t.type}{t.course && ` · ${t.course}`} · due {fmt(t.dueDate)} · {t.estimatedHours}h</span>
                    </div>
                    <div className="btns">
                      <button onClick={() => { setEditing(t); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button>
                      <button className="danger" onClick={() => remove(t._id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <aside><TaskForm editing={editing} onSave={save} onCancel={() => setEditing(null)} /></aside>
      </main>
    </div>
  );
}
