# Teacher AI Lesson Planner – Project Plan (v0.1)

## 1. Project Overview
This project is a web-based application designed to help **individual teachers in the Philippines** generate and iteratively refine lesson plans using AI.

Key characteristics:
- Per-teacher usage (no public sharing)
- No multi-tenant or school-wide model initially
- Aligned with DepEd standards and modules
- AI-assisted generation and regeneration of lesson plans based on student/class performance

The project will be developed incrementally, prioritizing simplicity, clarity, and future extensibility.

---

## 2. Technology Stack (Agreed)

### Frontend
- **Next.js (App Router, TypeScript)**
- Tailwind CSS for rapid UI development
- Initially deployed as a **static site** (GitHub Pages)

### Backend (later phase)
- **NestJS (TypeScript)**
- REST or JSON-based APIs
- Clean separation of domain logic and infrastructure

### Database
- **PostgreSQL**
- **Prisma ORM**
- JSONB used heavily in early stages to allow schema flexibility

### AI
- LLM-based generation using structured prompts
- Strict JSON schema outputs
- No RAG or document ingestion in the initial phase

---

## 3. Deployment Strategy (Progressive)

### Phase 1 – Static UI Prototype
- Static Next.js export (`output: 'export'`)
- Deployed to GitHub Pages
- Login page and basic navigation only
- No backend, no authentication, no database

Purpose:
- Visual demo
- UX validation
- Early stakeholder feedback

### Phase 2 – Full Stack Enablement
- Move hosting to Vercel / AWS / VPS
- Enable NestJS backend
- Add authentication
- Introduce Postgres + Prisma

---

## 4. Initial Feature Scope (MVP)

### Core Use Case
1. Teacher selects:
   - Grade level
   - Subject
   - DepEd competencies / standards
   - Constraints (time, modality, materials)
2. AI generates a **structured lesson plan**
3. Teacher reviews and edits
4. Teacher enters assessment results
5. AI regenerates or adapts the lesson plan

---

## 5. AI Design Philosophy (Simple First)

### Initial AI Capabilities
- Prompt-based lesson plan generation
- Regeneration using summarized performance inputs
- All AI outputs returned as structured JSON

### Explicitly Deferred
- Document ingestion / PDF parsing
- Vector databases / embeddings
- Per-student personalization
- Auto-grading

### Regeneration Model
- Teacher provides:
  - Score distribution / averages
  - Common misconceptions
  - Engagement notes
- AI produces:
  - Performance summary
  - Revised lesson plan
  - Change rationale

---

## 6. Data Modeling Strategy (Postgres + Prisma)

### Guiding Principles
- Start with **minimal stable entities**
- Use JSONB for evolving content
- Normalize only when patterns stabilize
- All schema changes via migrations
- Version everything

### Initial Tables
- `teachers` (or `users`)
- `lesson_plans`
- `lesson_plan_versions`

### Key Patterns
- AI-generated content stored as JSONB
- Frequently queried fields promoted to columns
- Each regeneration/edit creates a new version
- UUID primary keys for all entities
- `teacher_id` on all owned records

---

## 7. Versioning Strategy
- Lesson plans are immutable once created
- Each change creates a new `LessonPlanVersion`
- Store:
  - Generation reason
  - High-level prompt inputs
  - Timestamps

This prevents schema regret and enables rollback and comparison.

---

## 8. Authentication (Deferred)
- Static phase: no auth
- Backend phase:
  - Teacher-based login
  - Simple role model (teacher only)
  - Future-ready for expansion

---

## 9. Naming & Repository Strategy

### Repo Phases
- Single repo initially
- Later possible split:
  - `web` (Next.js)
  - `api` (NestJS)

### Suggested Files
- `PROJECT_PLAN.md` (this document)
- `README.md` (setup & usage)
- `ARCHITECTURE.md` (technical deep dive later)

---

## 10. Next Immediate Steps
1. Create Next.js app (App Router, TypeScript)
2. Configure static export for GitHub Pages
3. Implement static login page
4. Deploy UI demo
5. Iterate on UX before backend work begins
6. Start implementing authentication (add OAuth placeholders, enable provider flags, and plan backend integration)

---

## 11. Long-Term Evolution (Not Commitments)
- Class grouping
- Assessment history analytics
- Standards normalization
- Document-based standards ingestion (optional)
- Export formats (PDF, DOCX)
- Multi-tenant or school-wide mode (future)

---

## 12. Core Design Principle
> **Ship something simple, structured, and evolvable — avoid locking into premature complexity.**

This plan intentionally optimizes for:
- Early validation
- Clean evolution
- Low refactor cost

---

## 13. Implementation Progress

### Phase 1 – Static UI Prototype

#### ✅ Completed
- [x] Create Next.js app (App Router, TypeScript)
  - Created at `edu-ai-agent/` directory
  - Configured with ESLint, Tailwind CSS, TypeScript
  - Dependencies installed
- [x] Configure static export for GitHub Pages
  - Updated `next.config.ts` with `output: 'export'`
- [x] Implement static login page
  - Created `src/components/LoginForm.tsx`
  - Created `src/app/page.tsx` (login route)
- [x] Create dashboard page placeholder
  - Created `src/app/dashboard/page.tsx`

#### 🔄 In Progress
- [ ] Test locally (`npm run dev`)

#### ⏳ Not Started
- [ ] Build for static export (`npm run build`)
- [ ] Push to GitHub and configure Pages deployment
