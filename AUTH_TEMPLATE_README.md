# Auth Template Setup

## Quick Start (Generic)

This is a **reusable authentication template** (frontend + backend) for any project. Customize the branding and deploy.

### Frontend (`web/`)
```bash
cd web
npm install
cp .env.example .env.local
# Edit .env.local with your app name + API URL
npm run dev
```

Open `http://localhost:3000` — login page with OAuth buttons + generic branding.

### Backend (`api/`)
```bash
cd api
npm install
npx prisma migrate dev
npm run start:dev
```

API listens on `http://localhost:3001` — ready for auth handlers.

---

## Customization for Your Project

1. **Login Page Branding**
   - Edit `web/.env.local`:
     ```
     NEXT_PUBLIC_APP_NAME=Edu AI Agent
     NEXT_PUBLIC_APP_SUBTITLE=Teacher Lesson Planner
     ```
   - Add custom logo/colors in `web/src/app/globals.css`

2. **Dashboard**
   - Replace "Dashboard interface coming soon..." with your app features
   - Located at `web/src/app/dashboard/page.tsx`

3. **OAuth Providers**
   - Configure Google, Facebook, Twitter/X credentials
   - Add to `api/src/auth/strategies/` (Phase 2)
   - Update `.env` files with client IDs

---

## File Structure (Template)

```
├── web/               # Next.js login UI (generic, reusable)
│   ├── src/
│   │   ├── components/AuthProviderButtons.tsx  (reusable)
│   │   ├── components/LoginForm.tsx            (generic, branded via env)
│   │   ├── config/app.ts                       (app name/subtitle)
│   │   └── app/
│   │       ├── page.tsx                        (login page)
│   │       └── dashboard/page.tsx              (post-auth placeholder)
│   └── .env.example
├── api/               # NestJS auth backend
│   ├── src/
│   │   ├── auth/      (OAuth strategies + token mgmt)
│   │   ├── users/     (user entity + service)
│   │   └── app.module.ts
│   └── prisma/
│       └── schema.prisma
└── docs/
    └── current-state_01.md
```

---

## Next Steps

- [x] Generic auth UI + config
- [ ] Wire OAuth providers (Google, Facebook, Twitter/X)
- [ ] Add token/session management
- [ ] Connect frontend → backend API
- [ ] Test end-to-end auth flow

---

## For Future Projects

Clone this repo, update `.env`, customize dashboard, deploy!
