# Jobs API

A RESTful API for tracking job applications — built with Node.js, Express, and MongoDB. Includes JWT-based authentication, full CRUD for job listings, and a static frontend served from the same server.

**Live:** [jobs-api-deployed-iu8z.onrender.com](https://jobs-api-deployed-iu8z.onrender.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Security | Helmet, CORS, express-rate-limit |
| Frontend | Vanilla HTML/CSS/JS (served via express.static) |
| Deployment | Render |

---

## Features

- User registration and login with hashed passwords
- JWT-based protected routes
- Full CRUD for job applications (create, read, update, delete)
- Per-user data isolation — users only see their own jobs
- Rate limiting (100 requests per 15 minutes per IP)
- Centralized error handling with custom error classes
- Static frontend served from `/public`

---

## Project Structure

```
jobs-api-deployed/
├── controllers/
│   ├── auth.js          # register, login
│   └── jobs.js          # getAllJobs, getJob, createJob, updateJob, deleteJob
├── db/
│   └── connect.js       # Mongoose connection
├── errors/
│   ├── bad-request.js
│   ├── unauthenticated.js
│   ├── customErrorHandler.js
│   └── index.js
├── middlewares/
│   ├── async.js         # asyncWrapper HOF
│   ├── auth.js          # JWT verification
│   ├── errorhandler.js  # global error handler
│   └── notFound.js      # 404 handler
├── models/
│   ├── User.js
│   └── job.js
├── public/              # Static frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
├── routes/
│   ├── auth.js
│   └── jobs.js
├── app.js
└── package.json
```

---

## API Reference

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login and get token | No |

**Register / Login body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "user": { "name": "John Doe" },
  "token": "<jwt>"
}
```

---

### Jobs

All job routes require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/jobs` | Get all jobs for authenticated user |
| GET | `/api/v1/jobs/:id` | Get a single job |
| POST | `/api/v1/jobs` | Create a new job |
| PATCH | `/api/v1/jobs/:id` | Update a job |
| DELETE | `/api/v1/jobs/:id` | Delete a job |

**Job body:**
```json
{
  "position": "Backend Developer",
  "company": "Razorpay",
  "status": "pending",
  "jobType": "full-time"
}
```

**Status values:** `pending` | `interview` | `declined`  
**Job type values:** `full-time` | `part-time` | `remote` | `internship`

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/SugarJonnyy/jobs-api-deployed.git
cd jobs-api-deployed

# 2. Install dependencies
npm install

# 3. Create .env file
touch .env
```

Add to `.env`:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_LIFETIME=30d
PORT=3000
```

```bash
# 4. Start the server
npm start
```

Server runs at `http://localhost:3000`  
Frontend available at `http://localhost:3000`

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_LIFETIME` | Token expiry e.g. `30d` |
| `PORT` | Server port (Render sets this automatically) |

---

## Error Handling

All errors return a consistent shape:

```json
{ "msg": "Error description here" }
```

Custom error classes (`BadRequestError`, `UnauthenticatedError`) map to appropriate HTTP status codes. Unhandled errors fall through to the global error handler middleware.

---

## Deployment

Deployed on **Render** (free tier).  
Auto-deploys on every push to `main`.

> Note: Free tier spins down after inactivity. First request after idle may take 30–50 seconds.

---

## Author

**Saswata Das**  
B.Tech CSE (AI & ML) — Brainware University, Kolkata  
GitHub: [@SugarJonnyy](https://github.com/SugarJonnyy)