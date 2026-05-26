# Edu AI Agent - Current Project State

## Date
2026-05-26

## Workspace
- Repository root: `~/projects/edu-ai-agent/` (WSL native filesystem)
- Frontend uses **pnpm** (Node 20 via nvm); backend uses npm

---

## Phase 1 ✅ Complete
- Static Next.js login UI with OAuth provider button stubs
- Generic branding via env vars (`NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_SUBTITLE`)
- Dashboard placeholder page

---

## Phase 2 🔄 In Progress — OAuth working, production credentials pending

### What's done

**Local auth (end-to-end)**
- Register, login, JWT issuance, `/auth/me`, logout
- `LoginForm` POSTs to `/auth/register` and `/auth/login`; token stored in `localStorage` + `logged_in` cookie
- Dashboard calls `/auth/me` with Bearer token, shows email, handles logout
- Middleware protects `/dashboard/:path*` via `logged_in` cookie

**OAuth (Google, Facebook, X)**
- All three providers implemented using `passport-oauth2` (generic strategy)
- All OAuth endpoint URLs are env vars — swapping mock → prod requires only `.env` changes
- `AuthProviderButtons` renders `<a href>` anchor tags pointing to `GET /auth/oauth/{provider}`
- Backend issues JWT after OAuth callback, redirects to `{FRONTEND_URL}/auth/callback?token=...`
- `/auth/callback` page stores token, sets cookie, redirects to `/dashboard`
- Provider conflict handled: same email under a different provider returns a clear `ConflictException` message shown on the callback error UI
- Twitter removed; providers are Google, Facebook, X

**Mock OAuth server**
- `api/scripts/mock-oauth-server.ts` runs `oauth2-mock-server` on port 8080
- Per-provider mock profiles keyed by `client_id` — all three buttons testable simultaneously
- Start with `npm run mock:oauth` in the `api/` directory

**Unit tests**
- Backend (37 tests): auth service (12), users service (10), google/facebook/x strategies (5 each)
- Frontend (27 tests): LoginForm (15), AuthProviderButtons (6), AuthCallback (7)
- All passing; run with `npm test` (api) and `pnpm test` (web, requires Node 20)

### What's next
- Obtain real production credentials (Google Cloud Console, Facebook Developer, X Developer Portal)
- Write `SETUP.md` for local dev onboarding
- Consider `POST /auth/logout` backend endpoint
- Eventually: invalid/expired token → redirect to login

---

## Phase 3 ⏳ Not Started
Edu-specific features: lesson plan CRUD, AI generation, DepEd standards alignment, assessment feedback loop. Deferred until Phase 2 is stable and template is production-ready.

---

## Stack
- **Frontend**: Next.js 15 App Router + TypeScript + Tailwind CSS — `web/`, pnpm, Node 20
- **Backend**: NestJS + TypeScript — `api/`, npm
- **DB**: PostgreSQL (Docker: `edu-ai-db`) + Prisma ORM
- **Auth**: bcrypt + JWT (`@nestjs/jwt`) + Passport (`passport-local`, `passport-jwt`, `passport-oauth2`)
- **Testing**: Jest + React Testing Library (frontend); Jest + NestJS testing utilities (backend)

---

## Dev Commands

```bash
# Postgres
docker start edu-ai-db

# Mock OAuth server (terminal 1)
cd api && npm run mock:oauth

# Backend (terminal 2)
cd api && npm run start:dev

# Frontend (terminal 3)
cd web && nvm use 20 && pnpm dev

# Tests
cd api && npm test
cd web && nvm use 20 && pnpm test
```
