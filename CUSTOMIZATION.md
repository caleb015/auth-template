# Customization Guide

A checklist of every place that carries the template's default naming. Work through the **Required** section before going live; the **Optional** section covers things you may want to adjust depending on your project.

---

## Required Changes

### 1. App Name & Branding

**File:** `web/.env.example` → copy to `web/.env.local`

```env
NEXT_PUBLIC_APP_NAME=Your App Name
NEXT_PUBLIC_APP_SUBTITLE=Your tagline here
```

These two values drive the login page header and subtitle. They are also read by `web/src/app/layout.tsx` to set the browser tab title.

---

### 2. Database Name

The template uses `auth_template` as the development database name and `auth_template_test` for the E2E test database. Replace both with your project's name in the following files:

| File | What to change |
|------|---------------|
| `api/.env.example` (→ `api/.env`) | `DATABASE_URL` — replace `auth_template` |
| `api/.env.test.example` (→ `api/.env.test`) | `DATABASE_URL` — replace `auth_template_test` |

Also update the Docker command you use to create the database container (shown in `README.md`):

```bash
# Change auth_template → your_db_name
docker run --name auth-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=your_db_name -p 5432:5432 -d postgres:16
```

And update the E2E setup comment in `api/.env.test.example`:

```bash
# Change auth_template_test → your_db_name_test
docker exec <container> psql -U postgres -c "CREATE DATABASE your_db_name_test;"
```

---

### 3. JWT Secret (Production)

**File:** `api/.env`

The default value `change-me-in-dev` is intentionally weak. Replace it with a long random string before deploying:

```env
JWT_SECRET=replace-with-a-long-random-secret
```

Generate one with:

```bash
openssl rand -hex 64
```

---

### 4. Page Metadata

**File:** `web/src/app/layout.tsx`

The `metadata` export sets the browser tab title and meta description. It already reads from `NEXT_PUBLIC_APP_NAME` and `NEXT_PUBLIC_APP_SUBTITLE`, but double-check the fallback strings match your app:

```ts
export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Your App Name',
  description: process.env.NEXT_PUBLIC_APP_SUBTITLE || 'Your tagline here',
};
```

---

## Optional Changes

### OAuth Providers

**File:** `web/src/config/authProviders.ts`

Toggle which provider buttons appear on the login page:

```ts
export const AUTH_PROVIDERS = {
  google: true,     // show Google button
  facebook: false,  // hide Facebook button
  x: false,         // hide X button
};
```

When disabling a provider on the frontend, you can also remove the corresponding env vars from `api/.env` (and the backend strategy file) to keep things tidy.

When enabling real providers (production), replace the `*_AUTH_URL`, `*_TOKEN_URL`, `*_USERINFO_URL`, `*_CLIENT_ID`, and `*_CLIENT_SECRET` values in `api/.env` with credentials from each provider's developer console:

- **Google** — [Google Cloud Console](https://console.cloud.google.com/)
- **Facebook** — [Facebook Developer Portal](https://developers.facebook.com/)
- **X** — [X Developer Portal](https://developer.twitter.com/)

---

### Package Name

**File:** `web/package.json`

Change `"name": "auth-template"` to your project's package name:

```json
{
  "name": "your-app-name",
  ...
}
```

---

### Ports

The defaults are `3000` (frontend) and `3001` (API). To change them:

1. Update `PORT` in `api/.env`
2. Update `NEXT_PUBLIC_API_URL` in `web/.env.local`
3. Update all `*_CALLBACK_URL` and `*_LINK_CALLBACK_URL` values in `api/.env` — they include the API port in the URL

---

## Full Reference Table

| What | File | Key / Location |
|------|------|----------------|
| Login page title & subtitle | `web/.env.local` | `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_SUBTITLE` |
| Browser tab title & meta description | `web/src/app/layout.tsx` | `metadata` export |
| Database name (dev) | `api/.env` | `DATABASE_URL` |
| Database name (test) | `api/.env.test` | `DATABASE_URL` |
| JWT secret | `api/.env` | `JWT_SECRET` |
| OAuth providers shown on login | `web/src/config/authProviders.ts` | `AUTH_PROVIDERS` |
| OAuth credentials (all providers) | `api/.env` | `*_CLIENT_ID`, `*_CLIENT_SECRET`, etc. |
| API port | `api/.env` | `PORT` |
| Allowed frontend origin (CORS) | `api/.env` | `FRONTEND_URL` |
| Frontend package name | `web/package.json` | `"name"` |
