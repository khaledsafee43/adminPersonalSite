# Portfolio Admin Panel

A junior-friendly full-stack starter for managing a personal portfolio.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Lucide React
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, bcryptjs

## Requirements

Node.js 20+ and MongoDB Atlas or a local MongoDB instance.

## 1. Configure backend

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env` and set `MONGODB_URI`, `JWT_SECRET`, and `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
Then run:

```bash
npm install
npm run dev
```

The API runs at `http://https://adminpersonalsite.onrender.com`. On first startup, an admin is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD` if no admin with that email exists.

## 2. Configure frontend

In a second terminal:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## Demo sign-in

Use the email and password configured in `backend/.env`. There is no hard-coded public default password.

## Included pages

Overview, Home, About, Projects, Project Editor, Blog Posts, Blog Editor, Skills, Services, Resume, Contact Page, Messages, Clients, Project Requests, Notifications, SEO, Appearance, Languages, Security, Profile, General Settings, Login.

## API summary

- `POST /api/auth/login` — sign in
- `GET /api/auth/me` — current admin
- `PATCH /api/auth/profile` — update name/email
- `PATCH /api/auth/password` — change password
- `/api/content/:type` — CRUD for `home`, `about`, `projects`, `posts`, `skills`, `services`, `resume`, `contact`, `seo`, `appearance`, `languages`, `notifications`, `general`
- `/api/messages`, `/api/clients`, `/api/requests` — list, update status, delete
- `GET /api/dashboard` — dashboard statistics

## Notes before production

- Set a long random `JWT_SECRET` and strong admin password.
- Set `CLIENT_ORIGIN` to your deployed frontend URL.
- Add rate limiting, email verification / password recovery, audit logs, and automated tests before exposing this publicly.
- File uploads are represented by URL fields; this starter does not upload files to Cloudinary or disk.
- Keep `.env` files private. Never commit secrets.
