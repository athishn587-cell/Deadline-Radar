async function request(path, options = {}) {
  let res;
  try {
    res = await fetch('/api' + path, { headers: { 'Content-Type': 'application/json' }, ...options });
  } catch {
    throw new Error('Cannot reach the server. Is the API running on port 5000?');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = data.error || {};
    const err = new Error(e.message || `Request failed (${res.status})`);
    err.details = e.details || [];
    throw err;
  }
  return data;
}

export const api = {
  listTasks: () => request('/tasks'),
  createTask: (t) => request('/tasks', { method: 'POST', body: JSON.stringify(t) }),
  updateTask: (id, t) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(t) }),
  toggleTask: (id) => request(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  workload: ({ start, capacity, today }) => request(`/workload?start=${start}&capacity=${capacity}&today=${today}`),
};
