# Standard Login and Dashboard

A reusable, full-stack authentication template with email/password login, JWT session management, and a protected dashboard. Built to be cloned and customized as the auth foundation for any web app.

## Features

- Register and login with email + password
- JWT-based sessions stored in localStorage
- Protected dashboard route (middleware + server-side token verification)
- Logout clears session

## Stack

- **Frontend** — Next.js 15 (App Router, TypeScript, Tailwind CSS) — `web/`
- **Backend** — NestJS (TypeScript, Passport, JWT) — `api/`
- **Database** — PostgreSQL + Prisma ORM

## Local Development

### Prerequisites

- Docker (for Postgres)
- Node.js 20+ via nvm
- pnpm (for the frontend)

### Starting everything up

**Terminal 1 — Postgres**
```bash
docker start edu-ai-db
```

First time only:
```bash
docker run --name edu-ai-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=edu_ai_agent -p 5432:5432 -d postgres:16
```

**Terminal 2 — API** (runs on port 3001)
```bash
cd api
npm run start:dev
```

First time only, run the migration first:
```bash
cd api
npx prisma migrate dev
npm run start:dev
```

**Terminal 3 — Frontend** (runs on port 3000)
```bash
nvm use 20
cd web
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
.
├── web/      # Next.js frontend
├── api/      # NestJS backend
└── docs/     # Project plans and documentation
```
