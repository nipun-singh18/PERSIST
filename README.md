# PERSIST

### Personal Consistency & Progress Tracker

PERSIST is a full-stack web application for building consistency, tracking daily activities, maintaining streaks, and visualizing progress over time.

## 🏗️ Architecture
Frontend (HTML/CSS/JS) → REST API (Spring Boot) → MySQL


- **`/frontend`** — HTML, CSS, vanilla JavaScript. Currently using localStorage; will be migrated to call the real API below.
- **`/backend`** — Java Spring Boot REST API with a MySQL database via JPA/Hibernate.

## ✅ Backend Status: Functional API, Not Yet Connected to Frontend

The backend is a real, tested REST API with its own database, independent of the frontend's current localStorage implementation.

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- Passwords hashed with BCrypt.

**Users**
- `GET /api/users/{id}`

**Activities** (ownership-checked — a user can only modify their own)
- `POST /api/activities?userId={id}`
- `GET /api/activities?userId={id}` — includes computed current/best streak and completion history
- `PUT /api/activities/{id}?userId={id}`
- `DELETE /api/activities/{id}?userId={id}`

**Completions**
- `POST /api/activities/{activityId}/completions/toggle?userId={id}`

**Dashboard**
- `GET /api/dashboard/summary?userId={id}`
- `GET /api/dashboard/week?userId={id}`

**Health**
- `GET /api/health`

Streak calculation (`StreakService`) is unit tested — see `backend/src/test`.

## 🛠️ Tech Stack

**Frontend:** HTML, CSS, JavaScript (React planned)
**Backend:** Java, Spring Boot, Spring Data JPA
**Database:** MySQL
**Tools:** Git, GitHub, Maven, curl/Postman for API testing

## 🚀 Roadmap

- [x] Frontend UI (all pages, localStorage-based)
- [x] Backend: entities, schema, repositories
- [x] Backend: full REST API (auth, activities, completions, dashboard)
- [x] Password hashing, input validation, ownership checks
- [x] Unit tests for streak logic
- [ ] Replace frontend localStorage calls with real API calls (fetch)
- [ ] JWT-based authentication (replacing the current `userId` query param approach)
- [ ] React rewrite of the frontend
- [ ] Deployment (frontend + backend)

---

**PERSIST — Show up. Stay consistent. Keep progressing.**