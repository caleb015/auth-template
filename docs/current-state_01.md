# Edu AI Agent - Current Project State

## Date
2026-03-20

## Workspace
- Repository root: `edu-ai-agent/`
- Docs path: `edu-ai-agent/docs/`
- Frontend app path: `edu-ai-agent/web/`
- App source: `edu-ai-agent/web/src/app`

## Completed Phase 1 (Static UI Prototype)
- Next.js App Router + TypeScript initialized
- Tailwind CSS UI + layout in place
- `output: 'export'` configured in `next.config.ts`
- Static login page with fields + placeholder team
- Dashboard placeholder page in `web/src/app/dashboard/page.tsx`
- `AuthProviderButtons` component added with provider flags and icons
- Local dev run passes after Node + dependency fixes

## Authentication placeholder
- `src/config/authProviders.ts`: provider flags { google, facebook, twitter, x } (enabled)
- `src/components/AuthProviderButtons.tsx`: OAuth button placeholders w/ scripts
- `src/components/LoginForm.tsx`: includes `AuthProviderButtons` in login screen

## Dependency alignments
- `react-icons` installed
- Node 20.x required and in use
- `tailwindcss` resolved in app-level install
- `gh-pages` deploy steps prepared (still needs final deployment setup)

## Repository Structure (Post-Reorganization)
- `web/`: Next.js frontend (TypeScript, Tailwind, auth placeholders)
- `api/`: NestJS backend (to be scaffolded)
- `docs/`: Project documentation, plans, and status

## Pending / Next tasks
- Scaffold NestJS backend in `api/` folder
- Set up Prisma ORM + Postgres schema (User, LessonPlan, LessonPlanVersion)
- Implement Phase 2 auth integration (OAuth providers)
- Connect frontend to backend API endpoints
- Finish Phase 1 deploy via GitHub Pages (`npm run build`, `npm run deploy` from `web/`)
- Add tests for components and auth flows

## Setup & Run Commands
```bash
cd web/
npm install
npm run dev          # runs on http://localhost:3000
npm run build        # static export to web/out/
```

## Next: Backend Scaffold
```bash
cd api/
npx @nestjs/cli new . --skip-git
npm install @nestjs/config @nestjs/passport @prisma/client prisma passport passport-google-oauth20
npx prisma init
```

## Notes
- Lockfile at `web/package-lock.json` only (no redundant root lockfile)
- Monorepo workspaces optional; can manage `web/` and `api/` independently for now
- Frontend static export ready; backend auth coming Phase 2
