# Deadline Radar – Student Workload Planner

Records deadlines + estimated effort, then calculates a **weekly workload score** and highlights **overloaded days**.

**Stack:** React (Vite) · Node.js + Express REST API · MongoDB (Mongoose)

## Run it

Prerequisites: Node 18+, MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. API
cd server
cp .env.example .env      # edit MONGODB_URI if needed
npm install
npm run dev               # http://localhost:5000

# 2. UI (new terminal)
cd client
npm install
npm run dev               # http://localhost:5173  (proxies /api to :5000)
```

Optional: `cd server && npm run seed` loads sample tasks. `npm test` runs workload unit tests.

## How the workload score works

1. Each unfinished task's effort (hours) is spread over the days **leading up to its due date**
   (assignment 3 days, quiz 2, exam 5, project 7). Later days get more weight (ramp-up toward the deadline).
   If the start window has already passed, the effort is squeezed into the remaining days (today → due date).
2. Type multipliers reflect pressure: exam ×1.3, quiz ×1.1, project ×1.15, assignment ×1.0.
3. **Day load** = sum of weighted hours on that day. A day is **overloaded** when load > daily capacity
   (default 6 h, adjustable in the UI).
4. **Weekly score** = weekly weighted hours ÷ (daily capacity × 7) × 100.
   Levels: <50 Light · 50–79 Steady · 80–99 Heavy · ≥100 Overloaded.
   A week is also flagged if it contains any overloaded day.

## REST API

| Method | Path | Description |
|---|---|---|
| GET | /api/health | Health check |
| GET | /api/tasks?completed=true/false&type=exam | List tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| PATCH | /api/tasks/:id/toggle | Toggle completed |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/workload?start=YYYY-MM-DD&capacity=6&today=YYYY-MM-DD | 7-day workload + score |

Task body: `{ title, course?, type: assignment|quiz|exam|project, dueDate: "YYYY-MM-DD", estimatedHours: 0.25–100, notes? }`

Errors return `{ "error": { "message": "...", "details": [ ... ] } }` with 400 / 404 / 500 codes.
