import { useEffect, useState } from 'react';

const empty = { title: '', course: '', type: 'assignment', dueDate: '', estimatedHours: '', notes: '' };

export default function TaskForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(editing ? { ...empty, ...editing } : empty);
    setErrors([]);
  }, [editing]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const localCheck = () => {
    const errs = [];
    if (!form.title.trim()) errs.push('Enter a title.');
    if (!form.dueDate) errs.push('Pick a due date.');
    const h = Number(form.estimatedHours);
    if (!form.estimatedHours || !(h >= 0.25 && h <= 100)) errs.push('Estimated effort must be between 0.25 and 100 hours.');
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = localCheck();
    if (errs.length) return setErrors(errs);
    setBusy(true);
    try {
      const { title, course, type, dueDate, notes } = form;
      await onSave({ title, course, type, dueDate, notes, estimatedHours: Number(form.estimatedHours) });
      if (!editing) setForm(empty);
      setErrors([]);
    } catch (err) {
      setErrors([err.message, ...(err.details || [])]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="panel form" onSubmit={submit} noValidate>
      <h2>{editing ? 'Edit deadline' : 'Add a deadline'}</h2>
      <label>Title<input value={form.title} onChange={set('title')} maxLength={120} placeholder="e.g. OS lab report" /></label>
      <div className="row">
        <label>Course<input value={form.course} onChange={set('course')} maxLength={60} placeholder="CS204" /></label>
        <label>Type
          <select value={form.type} onChange={set('type')}>
            <option value="assignment">Assignment</option><option value="quiz">Quiz</option>
            <option value="exam">Exam</option><option value="project">Project</option>
          </select>
        </label>
      </div>
      <div className="row">
        <label>Due date<input type="date" value={form.dueDate} onChange={set('dueDate')} /></label>
        <label>Effort (hours)<input type="number" step="0.25" min="0.25" max="100" value={form.estimatedHours} onChange={set('estimatedHours')} /></label>
      </div>
      <label>Notes<textarea rows="2" maxLength={500} value={form.notes} onChange={set('notes')} /></label>
      {errors.length > 0 && <ul className="errors" role="alert">{errors.map((m, i) => <li key={i}>{m}</li>)}</ul>}
      <div className="actions">
        <button className="primary" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Add deadline'}</button>
        {editing && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
