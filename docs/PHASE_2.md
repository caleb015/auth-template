# Phase 2: Generic Auth Web App Template

**Date:** 2026-03-20  
**Status:** In Progress  
**Goal:** Build a reusable, cloneable authentication template (not edu-ai-agent specific)

---

## Project Scope (This Phase)

Build a **generic web app template** with:
- ✅ Generic Next.js login UI (completed)
- ✅ Generic branding via environment variables (completed)
- ⏳ NestJS auth backend with OAuth providers (in progress)
- ⏳ User persistence via PostgreSQL + Prisma (in progress)
- ⏳ JWT token management (to build)
- ⏳ End-to-end OAuth flow + dashboard redirect (to build)
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
- [ ] Prisma schema with `User` model (email, provider, providerId, timestamps)
- [ ] `auth.service.ts` — OAuth flow handlers (login, callback, token refresh)
- [ ] `jwt.service.ts` — JWT generation and validation
- [ ] Passport strategies: Google, Facebook, Twitter, X
- [ ] Auth endpoints:
  - `POST /auth/oauth/:provider` — initiate OAuth
  - `GET /auth/callback/:provider` — OAuth callback handler
  - `POST /auth/logout` — logout
  - `GET /auth/me` — get current user (JWT protected)
- [ ] CORS + cookie/token handling

### Frontend (`web/`)
- [ ] Connect login buttons to `api/auth/oauth/:provider`
- [ ] Handle OAuth redirect → `api/auth/callback/:provider`
- [ ] Store JWT token (localStorage or httpOnly cookie)
- [ ] Dashboard: fetch `/auth/me` to validate session
- [ ] Logout: clear token + redirect to login

### Testing
- [ ] Manual OAuth flow (all 4 providers)
- [ ] Token persistence across page reloads
- [ ] Logout clears session
- [ ] Invalid/expired tokens redirect to login

### Documentation
- [ ] `SETUP.md` — step-by-step to run locally
- [ ] `.env.example` files (both `web/` and `api/`)
- [ ] OAuth provider setup guide (Google, Facebook, Twitter, X credentials)
- [ ] Deployment notes (Vercel for `web/`, standalone `api/` server)

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

**Current:**
- `web/` generic login UI ✅
- `api/` empty NestJS scaffold ✅
- Prisma initialized (needs schema)
- Docs updated ✅

**Next:**
- Build `api/auth` module (strategies + services)
- Wire frontend → backend OAuth flow
- Test end-to-end

---

## Quick Commands

```bash
# Frontend
cd web
npm install
npm run dev

# Backend
cd api
npm install
npx prisma migrate dev
npm run start:dev
```

---

## References

- [Passport.js Strategies](http://www.passportjs.org/)
- [NestJS JWT](https://docs.nestjs.com/recipes/jwt)
- [Prisma User Guide](https://www.prisma.io/docs/)
