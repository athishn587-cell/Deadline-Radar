<div align="center">

# 📡 Deadline Radar

### A student workload planner that shows you *which days are about to break you*, before they do.

![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white)
![Deployed on Render](https://img.shields.io/badge/API-Render-46E3B7?logo=render&logoColor=white)

**[🚀 Live Demo](https://YOUR-APP.vercel.app)** · **[🔌 API Health Check](https://YOUR-API.onrender.com/api/health)**

</div>

---

## 🎯 The Problem

Students track deadlines in calendars and to-do lists, but those only show *when* things are due, not *how much work* is piling up. Three deadlines on Friday look harmless in a calendar. In reality, they might mean 20 hours of work squeezed into the days before.

## 💡 The Solution

**Deadline Radar** takes each task's due date and estimated effort, spreads that effort across the days leading up to the deadline, and calculates:

- a **daily load** for every day of the week,
- a **weekly workload score** (0–100+),
- **overloaded days**, flagged when load exceeds your daily capacity.

You see the crunch coming days in advance, and can reschedule before it happens.

<!-- Add a screenshot or GIF here — it is the single biggest upgrade to this README:
![Deadline Radar dashboard](docs/screenshot.png)
-->

## ✨ Features

- **Task management:** create, edit, complete, and delete tasks with course, type, due date, effort, and notes
- **Smart effort spreading:** effort ramps up toward the deadline instead of being dumped on one day
- **Type-aware pressure:** exams, projects, and quizzes weigh more than plain assignments
- **Weekly workload score** with four levels: Light, Steady, Heavy, Overloaded
- **Overloaded-day detection** against an adjustable daily capacity (default 6 hours)
- **Filtering** by completion status and task type
- **Validated REST API** with consistent error responses
- **Unit-tested workload engine** and a seed script for sample data

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express (REST API) |
| Database | MongoDB with Mongoose |
| Hosting | Vercel (client), Render (API), MongoDB Atlas (database) |

## 🧠 How the Workload Score Works

The core of the project is a small scheduling engine in the API.

**1. Spread the effort.** Each unfinished task's effort (hours) is distributed over the days leading up to its due date. Later days get more weight, modelling the ramp-up toward a deadline.

| Task type | Start window |
|---|---|
| Quiz | 2 days |
| Assignment | 3 days |
| Exam | 5 days |
| Project | 7 days |

If the start window has already passed, the effort is compressed into the remaining days (today → due date).

**2. Apply pressure multipliers.**

| Type | Multiplier |
|---|---|
| Exam | ×1.3 |
| Project | ×1.15 |
| Quiz | ×1.1 |
| Assignment | ×1.0 |

**3. Calculate daily load.** Day load is the sum of weighted hours on that day. A day is **overloaded** when its load exceeds your daily capacity.

**4. Calculate the weekly score.**

```
weekly score = weekly weighted hours ÷ (daily capacity × 7) × 100
```

For example, 30 weighted hours with a 6-hour capacity gives `30 ÷ 42 × 100 ≈ 71`, which is **Steady**.

| Score | Level |
|---|---|
| < 50 | 🟢 Light |
| 50–79 | 🟡 Steady |
| 80–99 | 🟠 Heavy |
| ≥ 100 | 🔴 Overloaded |

A week is also flagged if it contains any overloaded day, even when the overall score looks fine.

## 🔌 REST API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/tasks?completed=true\|false&type=exam` | List tasks (filterable) |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `PATCH` | `/api/tasks/:id/toggle` | Toggle completed |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/workload?start=YYYY-MM-DD&capacity=6&today=YYYY-MM-DD` | 7-day workload and score |

<details>
<summary><b>Example: create a task</b></summary>

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Operating Systems midterm",
  "course": "CS301",
  "type": "exam",
  "dueDate": "2026-11-20",
  "estimatedHours": 12,
  "notes": "Chapters 4–9"
}
```

`type` is one of `assignment | quiz | exam | project`, and `estimatedHours` must be between 0.25 and 100.

</details>

<details>
<summary><b>Error format</b></summary>

Errors return a consistent JSON body with a 400, 404, or 500 status:

```json
{
  "error": {
    "message": "Validation failed",
    "details": ["..."]
  }
}
```

</details>

## 🚀 Run It Locally

**Prerequisites:** Node 18+ and either a local MongoDB or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string.

```bash
# 1. API
cd server
cp .env.example .env      # then set MONGODB_URI
npm install
npm run dev               # http://localhost:5000

# 2. UI (new terminal)
cd client
npm install
npm run dev               # http://localhost:5173 (proxies /api to :5000)
```

**Optional**

```bash
cd server
npm run seed              # load sample tasks
npm test                  # run workload unit tests
```

> On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

### Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `MONGODB_URI` | server | MongoDB connection string |
| `FRONTEND_URL` | server | Allowed CORS origin |
| `VITE_API_URL` | client (production) | Base URL of the deployed API |

## ☁️ Deployment

- **Database:** MongoDB Atlas
- **API:** Render web service (root directory `server`, start command `npm start`)
- **Client:** Vercel (root directory `client`, framework preset Vite)

## 🛠️ What I Learned

- Designing a scoring model from vague requirements and turning it into testable pure functions
- Building and validating a REST API with consistent error handling
- Connecting a React client, an Express API, and a managed database across three separate hosts, including CORS and environment configuration

## 🗺️ Possible Improvements

- User accounts and authentication
- Calendar view and drag-to-reschedule
- Smarter suggestions for moving work off overloaded days
- Email or push reminders for upcoming crunch days

## 👤 Author

**Athish N**
GitHub: [@athishn587-cell](https://github.com/athishn587-cell)

---

<div align="center">
If this project is useful or interesting, a ⭐ on the repo is appreciated.
</div>
