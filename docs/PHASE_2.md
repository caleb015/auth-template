# Phase 2: Generic Auth Web App Template

**Date:** 2026-03-20 (updated 2026-05-25)
**Status:** In Progress  
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
- ⏳ OAuth providers — Google in progress, Facebook/Twitter/X pending
- ⏸️ **NO lesson-plan/teacher logic yet** — save for Phase 3

---

## Architecture (This Phase)

```
auth-template/
├── web/                       # Next.js login UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx              (generic, env-branded)
│   │   │   └── AuthProviderButtons.tsx    (generic)
│   │   ├── config/
│   │   │   └── app.ts                     (app name/subtitle from env)
│   │   └── app/
│   │       ├── page.tsx                   (login page)
│   │       └── dashboard/page.tsx         (post-auth placeholder)
│   ├── .env.example
│   └── package.json
│
├── api/                       # NestJS auth service
│   ├── src/
│   │   ├── auth/
│   │   │   ├── strategies/
│   │   │   │   ├── google.strategy.ts
│   │   │   │   ├── facebook.strategy.ts
│   │   │   │   ├── twitter.strategy.ts
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts        (OAuth handlers)
│   │   │   │   └── jwt.service.ts         (token mgmt)
│   │   │   ├── controllers/
│   │   │   │   └── auth.controller.ts     (OAuth endpoints)
│   │   │   └── auth.module.ts
│   │   ├── users/
│   │   │   ├── user.entity.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   └── app.module.ts
│   ├── prisma/
│   │   ├── schema.prisma                  (User model only)
│   │   └── migrations/
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── current-state_01.md
│   ├── PHASE_2.md                         (this file)
│   └── SETUP.md
│
└── README.md                              (usage + customization)
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
  - `GET /auth/oauth/:provider` — stub (real flow pending per provider)
  - `GET /auth/callback/:provider` — stub (real flow pending per provider)
- [x] CORS configured
- [ ] Passport strategies: Google (in progress), Facebook, Twitter, X
- [ ] `POST /auth/logout` endpoint (currently handled client-side only)

### Frontend (`web/`)
- [x] LoginForm POSTs to `/auth/login` and `/auth/register`
- [x] JWT stored in localStorage; `logged_in` cookie set for middleware
- [x] Dashboard: fetches `/auth/me` to validate session, shows email
- [x] Logout: clears localStorage + cookie, redirects to login
- [x] Middleware protects `/dashboard/:path*` via `logged_in` cookie
- [ ] Connect OAuth buttons to real `/auth/oauth/:provider` redirects
- [ ] `/auth/callback` page to receive token from backend OAuth redirect

### Testing
- [x] Local email/password login end-to-end
- [x] Registration flow
- [x] Invalid credentials show error message
- [x] Token persistence across page reloads
- [x] Logout clears session
- [ ] OAuth flow (all 4 providers)
- [ ] Invalid/expired tokens redirect to login

### Documentation
- [ ] `SETUP.md` — step-by-step to run locally
- [x] `.env.example` — `api/`
- [ ] `.env.example` — `web/`
- [ ] OAuth provider setup guide (Google, Facebook, Twitter, X credentials)
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
```
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/callback/google

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:3001/auth/callback/facebook

TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_CALLBACK_URL=http://localhost:3001/auth/callback/twitter

X_API_KEY=
X_API_SECRET=
X_CALLBACK_URL=http://localhost:3001/auth/callback/x

WEB_URL=http://localhost:3000
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

**Current (2026-05-25):**
- `web/` — Next.js 15, pnpm, login/register/dashboard wired to API ✅
- `api/` — NestJS, local auth fully working, OAuth stubs in place ✅
- Prisma User model migrated and running in Docker Postgres ✅
- Workspace moved to WSL native filesystem (`~/projects/edu-ai-agent`) ✅

**Next:**
- Implement Google OAuth (see `PHASE_2_GOOGLE_OAUTH.md`)
- Follow with Facebook, Twitter, X using same pattern
- Write `SETUP.md` for local dev onboarding

---

## Quick Commands

```bash
# Postgres (Docker)
docker start edu-ai-db

# Backend
cd api
npm run start:dev

# Frontend
cd web
pnpm dev
```

---

## References

- [Passport.js Strategies](http://www.passportjs.org/)
- [NestJS JWT](https://docs.nestjs.com/recipes/jwt)
- [Prisma User Guide](https://www.prisma.io/docs/)
