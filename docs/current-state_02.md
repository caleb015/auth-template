# Edu AI Agent - Current Project State

## Date
2026-05-25

## Workspace
- Repository root: `~/projects/edu-ai-agent/` (WSL native filesystem)
- Moved from `/mnt/c/...` to fix file I/O and npm permission issues caused by running on the Windows filesystem through WSL

---

## Phase 1 ✅ Complete
- Static Next.js login UI with OAuth provider button stubs
- Generic branding via env vars (`NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_SUBTITLE`)
- Dashboard placeholder page

---

## Phase 2 🔄 In Progress

### What's done
- **Local auth end-to-end**: register, login, JWT issuance, `/auth/me`, logout
- **Prisma User model**: `id`, `email`, `password?`, `provider` (default `"local"`), `providerId?`, timestamps
- **Frontend wired**: `LoginForm` POSTs to `/auth/register` and `/auth/login`; token stored in `localStorage`; `logged_in` cookie set for middleware
- **Dashboard**: calls `/auth/me` with Bearer token to verify session, shows email, handles logout
- **Middleware**: protects `/dashboard/:path*` via `logged_in` cookie — redirects to `/` if missing
- **CORS** configured on NestJS backend
- **Next.js 15** (downgraded from 16); `output: 'export'` removed (was blocking middleware)
- **pnpm** used for frontend (not npm); `web/.npmrc` has `shamefully-hoist=true`
- **OAuth stubs** in place for Google, Facebook, Twitter, X (not real flows yet)

### What's next
- Google OAuth (see `PHASE_2_GOOGLE_OAUTH.md`) — `passport-google-oauth20` already installed
- Facebook, Twitter, X OAuth — follow same pattern after Google is confirmed
- `web/.env.example` — not yet created
- `SETUP.md` — local dev onboarding doc not yet written

---

## Phase 3 ⏳ Not Started
Edu-specific features: lesson plan CRUD, AI generation, DepEd standards alignment, assessment feedback loop. Deferred until Phase 2 is stable.

---

## Stack
- **Frontend**: Next.js 15 App Router + TypeScript + Tailwind CSS — `web/`, uses **pnpm**
- **Backend**: NestJS + TypeScript — `api/`, uses npm
- **DB**: PostgreSQL (Docker: `edu-ai-db`) + Prisma ORM
- **Auth**: bcrypt + JWT (`@nestjs/jwt`) + Passport (`passport-local`, `passport-jwt`)

## Dev Commands
```bash
docker start edu-ai-db          # Postgres
cd api && npm run start:dev     # API on :3001
cd web && pnpm dev              # Frontend on :3000
```
