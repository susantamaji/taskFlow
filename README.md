# TaskFlow — MERN Student Edition

A responsive project and task management application built with React, Tailwind CSS, Recharts, Express, MongoDB and JWT.

## Requirements
- Node.js 20+ (Node 22 recommended)
- MongoDB local instance or MongoDB Atlas
- npm

## Setup
1. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` and a long random `JWT_SECRET`.
2. Copy `client/.env.example` to `client/.env`.
3. In one terminal:
   ```bash
   cd server
   npm install
   npm run dev
   ```
4. In another terminal:
   ```bash
   cd client
   npm install
   npm run dev
   ```
5. Open http://localhost:5173.

## Docker
Set `JWT_SECRET` in `server/.env`, then run from the project root:
```bash
docker compose up --build
```
The client is available at http://localhost:5173 and API at http://localhost:5000/api.

## Main API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET|POST /api/projects`
- `GET|PATCH|DELETE /api/projects/:id`
- `GET|POST /api/tasks`
- `GET|PATCH|DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `GET /api/users`

Protected routes require `Authorization: Bearer <token>`. Passwords are stored as bcrypt hashes. Project owners manage their projects and tasks; task assignees can update only task status.

## Tests
```bash
cd server
npm install
npm test
```
Tests use an isolated in-memory MongoDB instance.

## Notes
- Create two accounts to demonstrate owner and assignee permissions.
- No demonstration credentials are hard-coded.
- JWT is stored in localStorage in this student implementation. For a production deployment, consider secure, httpOnly cookies, CSRF protections, rate limiting, email verification, and centralized logging.
