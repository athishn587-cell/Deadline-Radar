import { dayName, fmt } from '../dates.js';

export default function WeekRadar({ data, selected, onSelect }) {
  const max = Math.max(data.capacity * 1.5, ...data.days.map((d) => d.load));
  return (
    <div className="radar" role="list" aria-label="Daily workload">
      {data.days.map((d) => (
        <button key={d.date} role="listitem" className={`col ${d.overloaded ? 'over' : ''} ${selected === d.date ? 'sel' : ''}`}
          onClick={() => onSelect(d.date)} aria-label={`${fmt(d.date)}: ${d.load} hours${d.overloaded ? ', overloaded' : ''}`}>
          <span className="val">{d.load}h</span>
          <span className="bar-wrap">
            <span className="limit" style={{ bottom: `${(data.capacity / max) * 100}%` }} />
            <span className="bar" style={{ height: `${(d.load / max) * 100}%` }} />
          </span>
          <span className="lbl">{dayName(d.date)}<small>{fmt(d.date, { day: 'numeric' })}</small></span>
          {d.dueToday.length > 0 && <span className="due-dot" title={`${d.dueToday.length} due`}>{d.dueToday.length}</span>}
        </button>
      ))}
    </div>
  );
}
