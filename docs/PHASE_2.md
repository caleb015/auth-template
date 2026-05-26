# Phase 2: Generic Auth Web App Template

**Date:** 2026-03-20 (updated 2026-05-26)
**Status:** In Progress — OAuth complete, production credentials pending  
**Goal:** Build a reusable, cloneable authentication template (not edu-ai-agent specific)

---

## Project Scope (This Phase)

Build a **generic web app template** with:
- ✅ Generic Next.js login UI (completed)
- ✅ Generic branding via environment variables (completed)
- ✅ NestJS auth backend — local email/password complete
- ✅ User persistence via PostgreSQL + Prisma (complete)
- ✅ JWT token management (complete)
- ✅ End-to-end local auth flow + dashboard redirect (complete)
- ✅ OAuth providers — Google, Facebook, X implemented (mock server for dev)
- ✅ Frontend callback page + provider conflict error handling
- ✅ Unit tests — backend (auth service, strategies, users service) + frontend (27 tests)
- ⏳ Production OAuth credentials (Google Cloud, Facebook Developer, X Developer Portal)
- ⏸️ **NO lesson-plan/teacher logic yet** — save for Phase 3

---

## Architecture (This Phase)

```
auth-template/
├── web/                       # Next.js 15 login UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx              (generic, env-branded)
│   │   │   └── AuthProviderButtons.tsx    (anchor tags → backend OAuth routes)
│   │   ├── config/
│   │   │   └── app.ts                     (app name/subtitle from env)
│   │   ├── app/
│   │   │   ├── page.tsx                   (login page)
│   │   │   ├── dashboard/page.tsx         (post-auth placeholder)
│   │   │   └── auth/callback/page.tsx     (receives ?token= or ?error= from backend)
│   │   └── __tests__/
│   │       ├── LoginForm.test.tsx
│   │       ├── AuthProviderButtons.test.tsx
│   │       └── AuthCallback.test.tsx
│   ├── jest.config.ts
│   ├── jest.setup.ts
│   ├── .env.example
│   └── package.json
│
├── api/                       # NestJS auth service
│   ├── src/
│   │   ├── auth/
│   │   │   ├── google.strategy.ts         (passport-oauth2, env-driven URLs)
│   │   │   ├── facebook.strategy.ts
│   │   │   ├── x.strategy.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── local.strategy.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts         (real OAuth + callback routes)
│   │   │   └── auth.module.ts
│   │   ├── users/
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   └── app.module.ts
│   ├── scripts/
│   │   └── mock-oauth-server.ts           (oauth2-mock-server, port 8080)
│   ├── prisma/
│   │   ├── schema.prisma                  (User model only)
│   │   └── migrations/
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── current-state_01.md
│   ├── current-state_02.md
│   ├── current-state_03.md
│   ├── PHASE_2.md                         (this file)
│   ├── PHASE_2_GOOGLE_OAUTH.md
│   └── PHASE_2_LOCAL_AUTH.md
│
└── README.md
```

---

## Implementation Checklist (Phase 2)

### Backend (`api/`)
- [x] Prisma schema with `User` model (email, provider, providerId, timestamps)
- [x] `auth.service.ts` — local auth + OAuth user find-or-create + JWT login
- [x] JWT generation and validation via `@nestjs/jwt` + `JwtStrategy`
- [x] `LocalStrategy` — email/password via bcrypt
- [x] Auth endpoints:
  - `POST /auth/register` — create local user
  - `POST /auth/login` — local login, returns JWT
  - `GET /auth/me` — get current user (JWT protected)
  - `GET /auth/oauth/google|facebook|x` — Passport-guarded redirect to provider
  - `GET /auth/callback/google|facebook|x` — receives code, issues JWT, redirects frontend
- [x] CORS configured
- [x] `GoogleStrategy`, `FacebookStrategy`, `XStrategy` via `passport-oauth2` (all URLs are env vars — swap mock → prod with no code changes)
- [x] `ConflictException` when same email exists under a different provider (clear user-facing message)
- [x] Mock OAuth server (`scripts/mock-oauth-server.ts`) — per-provider profiles, port 8080
- [x] Unit tests: auth service (12), users service (10), each strategy (5 each) = 37 backend tests
- [ ] `POST /auth/logout` endpoint (currently handled client-side only)

### Frontend (`web/`)
- [x] LoginForm POSTs to `/auth/login` and `/auth/register`
- [x] JWT stored in localStorage; `logged_in` cookie set for middleware
- [x] Dashboard: fetches `/auth/me` to validate session, shows email
- [x] Logout: clears localStorage + cookie, redirects to login
- [x] Middleware protects `/dashboard/:path*` via `logged_in` cookie
- [x] `AuthProviderButtons` — Google, Facebook, X anchor tags pointing to backend OAuth routes
- [x] `/auth/callback` page — stores token + cookie on `?token=`, shows error UI on `?error=`
- [x] Unit tests: LoginForm (15), AuthProviderButtons (6), AuthCallback (7) = 28 frontend tests

### Testing
- [x] Local email/password login end-to-end
- [x] Registration flow
- [x] Invalid credentials show error message
- [x] Token persistence across page reloads
- [x] Logout clears session
- [x] OAuth flow working end-to-end via mock server (all 3 providers)
- [x] Provider conflict (same email, different provider) handled gracefully
- [ ] OAuth flow with real production credentials
- [ ] Invalid/expired tokens redirect to login

### Documentation
- [ ] `SETUP.md` — step-by-step to run locally
- [x] `.env.example` — `api/` (mock values included, prod instructions in comments)
- [x] `.env.example` — `web/`
- [ ] OAuth provider setup guide (Google Cloud Console, Facebook Developer, X Developer Portal)
- [ ] Deployment notes

---

## Environment Variables (Phase 2)

### `web/.env.example`
```
NEXT_PUBLIC_APP_NAME=My App
NEXT_PUBLIC_APP_SUBTITLE=Welcome
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### `api/.env.example`
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/edu_ai_agent?schema=public
JWT_SECRET=change-me-in-dev
JWT_EXPIRES_IN=7d

# Dev: start mock server with `npm run mock:oauth`, use values below as-is
# Prod: replace with real credentials
GOOGLE_CLIENT_ID=mock-google-client-id
GOOGLE_CLIENT_SECRET=mock-client-secret
GOOGLE_AUTH_URL=http://localhost:8080/authorize
GOOGLE_TOKEN_URL=http://localhost:8080/token
GOOGLE_USERINFO_URL=http://localhost:8080/userinfo
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/callback/google

FACEBOOK_APP_ID=mock-facebook-client-id
FACEBOOK_APP_SECRET=mock-client-secret
FACEBOOK_AUTH_URL=http://localhost:8080/authorize
FACEBOOK_TOKEN_URL=http://localhost:8080/token
FACEBOOK_USERINFO_URL=http://localhost:8080/userinfo
FACEBOOK_CALLBACK_URL=http://localhost:3001/auth/callback/facebook

X_API_KEY=mock-x-client-id
X_API_SECRET=mock-client-secret
X_AUTH_URL=http://localhost:8080/authorize
X_TOKEN_URL=http://localhost:8080/token
X_USERINFO_URL=http://localhost:8080/userinfo
X_CALLBACK_URL=http://localhost:3001/auth/callback/x
```

### `web/.env.example`
```env
NEXT_PUBLIC_APP_NAME=My App
NEXT_PUBLIC_APP_SUBTITLE=Welcome
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Known Limitations (Phase 2)

- No multi-tenancy (one user = one account)
- No user profile data beyond email + provider
- No account linking (one provider per email)
- OAuth scopes minimal (email only)
- No refresh token rotation yet

These are acceptable for a template; can be added later.

---

## Success Criteria

✅ Complete when:
1. User can log in via any OAuth provider
2. JWT token stored and validated
3. Dashboard shows user email post-login
4. Logout clears session
5. `README.md` has clear setup + customization steps
6. Repo is ready to mark as GitHub template

---

## After Phase 2: Phase 3 (edu-ai-agent specifics)

Once Phase 2 is complete and template is stable:
- Add `lesson_plans`, `lesson_plan_versions` tables to Prisma
- Build lesson plan CRUD endpoints in `api/`
- Add lesson plan UI to `web/` dashboard
- Rename placeholder branding to "Edu AI Agent"
- Integrate AI generation endpoints (placeholder for now)

---

## Repository State

**Current (2026-05-26):**
- `web/` — Next.js 15, pnpm, login/register/dashboard wired to API ✅
- `api/` — NestJS, local auth + all three OAuth providers (Google, Facebook, X) fully working ✅
- Mock OAuth server running on port 8080 for local dev (no real credentials needed) ✅
- Frontend `/auth/callback` page handles token storage and error display ✅
- 37 backend unit tests + 27 frontend unit tests all passing ✅
- Prisma User model migrated and running in Docker Postgres ✅
- Workspace on WSL native filesystem (`~/projects/edu-ai-agent`) ✅

**Next:**
- Wire up real production credentials (Google Cloud Console, Facebook Developer, X Developer Portal)
- Write `SETUP.md` for local dev onboarding
- Consider `POST /auth/logout` backend endpoint

---

## Quick Commands

```bash
# Postgres (Docker)
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

---

## References

- [Passport.js Strategies](http://www.passportjs.org/)
- [NestJS JWT](https://docs.nestjs.com/recipes/jwt)
- [Prisma User Guide](https://www.prisma.io/docs/)
