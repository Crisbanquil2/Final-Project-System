# Enrollment / School Management Application

A full-stack **Enrollment / School Management** application with a React frontend and Laravel REST API backend. It includes authentication (login, logout, password reset), a protected dashboard, and modules for programs (courses), students, school days, and dashboard statistics.

---

## Technologies Used (with versions)

| Layer     | Technology        | Version / notes |
|----------|--------------------|-----------------|
| Frontend | React              | ^19.2.0        |
| Frontend | React Router DOM   | ^7.13.1        |
| Frontend | Vite               | ^7.3.1         |
| Frontend | MUI (Material UI)  | ^7.3.9         |
| Frontend | Recharts           | ^3.7.0         |
| Backend  | PHP                | ^8.2           |
| Backend  | Laravel            | ^12.0          |
| Backend  | Laravel Sanctum    | ^4.3 (API auth)|
| Database | SQLite (default)   | —              |

Exact versions are in `package.json` (frontend) and `it15-backend/composer.json` (backend).

---

## Setup Instructions

### Prerequisites

- **PHP** 8.2+ with extensions: `mbstring`, `openssl`, `pdo`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`
- **Composer**
- **Node.js** 18+ and **npm**

### Backend setup (Laravel API)

```bash
cd it15-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Backend runs at **http://localhost:8000** (API base: `http://localhost:8000/api`).  
Database default is **SQLite** (file in `it15-backend/database/`). For MySQL/PostgreSQL, set `DB_*` in `.env`.

### Frontend setup (React)

From the **project root** (where `package.json` and `src/` are):

```bash
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** (Vite default).  
For production: `npm run build` then `npm run preview`.

### Environment variables

**Backend (`it15-backend/.env`):**

- `APP_KEY` — Set by `php artisan key:generate`
- `APP_URL` — e.g. `http://localhost:8000`
- `FRONTEND_URL` — e.g. `http://localhost:5173` (for password reset links)
- `DB_CONNECTION`, `DB_DATABASE`, etc. — Database config (default SQLite)
- `MAIL_*` — For “Forgot password” email (e.g. Gmail SMTP); see `it15-backend/.env.example`

**Frontend (optional):**

- `VITE_API_BASE_URL` — API base URL (default: `http://localhost:8000/api`). Set only if the API runs elsewhere.

---

## What the application does

- **Frontend (React + Vite)**  
  Login page, password reset flow, and protected routes. After login, users see a dashboard with charts (enrollment, courses, attendance) and sidebar navigation to: Dashboard, Programs, Students, Courses Offered, School Days. All API calls use the shared `api` service and send the Sanctum token when logged in.

- **Backend (Laravel)**  
  REST API with Laravel Sanctum for token-based authentication. Handles: register, login, logout, forgot password, reset password; dashboard stats (enrollment, courses, attendance, summary); CRUD for programs (courses); listing students and school days. Database: `users`, `courses`, `students`, `school_days`, and supporting tables (migrations and seeders in `it15-backend`).

---

## API documentation

Base URL: `http://localhost:8000/api` (or `APP_URL` + `/api`).

### Public endpoints (no auth)

| Method | Endpoint              | Description        | Request body (JSON) | Response |
|--------|------------------------|--------------------|----------------------|----------|
| POST   | `/register`            | Create account     | `name`, `email`, `password`, `password_confirmation` | `201`: `{ "message", "user": { "id", "name", "email" }, "token" }` |
| POST   | `/login`               | Login              | `email`, `password`  | `200`: `{ "message", "user": { "id", "name", "email" }, "token" }` |
| POST   | `/forgot-password`     | Send reset link    | `email`              | `200`: `{ "message" }` |
| POST   | `/reset-password`      | Reset password     | `email`, `token`, `password`, `password_confirmation` | `200`: `{ "message" }` |

### Protected endpoints (require `Authorization: Bearer <token>`)

| Method | Endpoint                      | Description              | Response |
|--------|--------------------------------|--------------------------|----------|
| POST   | `/logout`                      | Invalidate current token | `200`: `{ "message" }` |
| GET    | `/dashboard/enrollment`       | Enrollment by month      | `200`: `[{ "month", "total" }, ...]` |
| GET    | `/dashboard/courses`          | Course enrollment counts | `200`: `[{ "id", "name", "total" }, ...]` |
| GET    | `/dashboard/attendance`       | School days attendance   | `200`: `[{ "date", "type", "present_students", "absent_students" }, ...]` |
| GET    | `/summary`                    | Counts (students, courses, school_days) | `200`: `{ "students", "courses", "school_days" }` |
| GET    | `/programs`                   | List programs (courses)  | `200`: array of course objects |
| POST   | `/programs`                   | Create program           | Body: `code`, `name`, `units`, optional `department`, etc. → `201`: `{ "message", "course" }` |
| GET    | `/students`                   | List students with course | `200`: `[{ "id", "student_no", "first_name", "last_name", "gender", "age", "year_level", "department", "course", "enrolled_at" }, ...]` |
| GET    | `/school-days`               | List school days         | `200`: `[{ "id", "date", "type", "present_students", "absent_students", "description" }, ...]` |

Errors: API returns JSON with `message` and appropriate HTTP status (e.g. `401` invalid credentials, `422` validation errors).

---

## Project structure (brief)

```
front-end/
├── README.md                 # This file
├── package.json              # Frontend dependencies
├── src/
│   ├── App.jsx               # Routes and layout
│   ├── auth/                 # Auth context
│   ├── components/           # Pages and UI (Dashboard, Sidebar, Login, etc.)
│   └── services/
│       └── api.js            # API client (base URL, Bearer token)
└── it15-backend/             # Laravel API
    ├── .env.example
    ├── app/Http/Controllers/Api/  # Auth, Course, Dashboard, SchoolDay, Student
    ├── app/Models/
    ├── database/migrations/
    ├── database/seeders/
    └── routes/api.php        # API routes
```
