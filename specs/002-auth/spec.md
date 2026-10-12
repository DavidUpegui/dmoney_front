# Feature: Authentication

- **Status:** `draft`
- **Folder:** `002-auth`
- **Related area:** `auth`

## 1. Overview

Lets the user register and log in, persists the JWT securely, gates the app on
session state, and logs out. On launch the app restores a persisted token and
skips login while it remains valid; any `401` from a protected endpoint clears
the session and returns the user to Login.

Actors: a prospective user (register) and an existing `dmoney` user (login).
The token is the only credential carried between requests.

## 2. Requirements

### Functional (FR)

- **FR-1** — A Login screen collects `email` + `password`, calls
  `POST /auth/login`, and stores the returned `token` via `tokenStore`.
- **FR-2** — A Register screen collects `email` + `password` + `name`, calls
  `POST /auth/register` (which returns `userId`), then either auto-logs in or
  redirects to Login.
- **FR-3** — On app launch the auth gate reads the persisted token; while
  hydrating it shows a splash, then routes to `(tabs)` if a token exists, else
  `(auth)/login`.
- **FR-4** — Logout (Settings tab) clears the token and navigates to Login.
- **FR-5** — Any `401` on a protected endpoint clears the token and redirects
  to Login (a single global handler, not per-screen).
- **FR-6** — Login/Register show inline validation and disable submit while a
  request is in flight (no duplicate submits).
- **FR-7** — Login/Register surface backend `message` (e.g. bad credentials,
  duplicate email) inline.

### Non-functional (NFR)

- **NFR-1** — Security: password is never logged or persisted; token only in
  `expo-secure-store`.
- **NFR-2** — The auth gate must not flash Login/Tabs during hydration.
- **NFR-3** — Accessibility: forms have labelled fields and readable errors.

## 3. Navigation & Routes

```
src/app/
  _layout.tsx            # auth gate: splash → (auth) | (tabs)
  (auth)/
    _layout.tsx          # Stack
    login.tsx            # /login
    register.tsx         # /register
  (tabs)/
    settings.tsx         # logout button
```

- `login.tsx` and `register.tsx` become real screens (replacing placeholders).
- After successful login → `router.replace('/(tabs)')`.
- `register.tsx` links to `login.tsx` and vice versa.

## 4. Screens & UI

| Screen | Route | States & affordances |
|--------|-------|----------------------|
| `Login` | `/login` | idle form; submitting (button disabled + spinner); error → inline banner with `message`; no content/empty state |
| `Register` | `/register` | same pattern; success → navigate to Login (or auto-login) |
| `Settings` | `/settings` | shows logged-in context + **Cerrar sesión** (logout) button |

Reusable: `TextInput` (labelled), `Button` from 001-foundation.

## 5. Data Fetching & API

| Method | Path | Query / Mutation | Cache key |
|--------|------|------------------|-----------|
| `POST` | `/auth/login` | `useLogin` (mutation) | — |
| `POST` | `/auth/register` | `useRegister` (mutation) | — |

### Request / Response examples

```json
POST /auth/login
{ "email": "a@b.com", "password": "secret" }
→ 200 { "token": "eyJhbGciOi..." }
```

```json
POST /auth/register
{ "email": "a@b.com", "password": "secret", "name": "Alice" }
→ 201 { "userId": "0f7b..." }
```

### Status code → UI mapping

- `200` (login) — store token → navigate to tabs
- `201` (register) — show success / navigate to Login
- `400` — validation error → inline `message`
- `401` — invalid credentials → inline "credenciales inválidas"
- `409` — duplicate email (register) → inline `message`
- `5xx` — retryable error banner

## 6. Data Model

```ts
type LoginRequest = { email: string; password: string };
type LoginResponse = { token: string };
type RegisterRequest = { email: string; password: string; name: string };
type RegisterResponse = { userId: string };
```

Session state: `{ token: string } | null`, derived from `tokenStore`.

## 7. Business Rules & Validation

- **BR-1** — Email must match `/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/` (client
  mirror of backend), trimmed + lowercased before submit.
- **BR-2** — Password must be non-blank.
- **BR-3** — Register `name` must be non-blank and ≤ 100 chars.
- **BR-4** — Submit is disabled while a mutation is pending.
- **BR-5** — Login success is the only path that stores a token; register does
  not store a token unless it auto-logs in.
- **BR-6** — A `401` anywhere clears the token and redirects to Login (global).

## 8. Edge Cases

- Token expires (24h, no refresh) → first protected call returns `401` → global
  handler clears token and redirects.
- Duplicate email on register → `409` → inline error.
- Empty email/password → client-side validation blocks submit.
- SecureStore write fails → surface error, don't leave a half-session.
- App killed and relaunched → token restored, skip login.
- Slow network → spinner + disabled submit (no duplicate requests).

## 9. Acceptance Criteria

- **AC-1** — Given valid credentials, when the user submits Login, then the
  token is stored and the app navigates to the tabs.
- **AC-2** — Given invalid credentials, when Login returns `401`, then an
  inline error is shown and no token is stored.
- **AC-3** — Given a valid register payload, when submitted, then `201` is
  received and the user is taken to Login (or logged in).
- **AC-4** — Given a persisted token at launch, when the app starts, then it
  skips Login and shows the tabs (no flash).
- **AC-5** — Given any protected request returns `401`, when it happens, then
  the token is cleared and the user is redirected to Login.
- **AC-6** — Given the user taps logout, when confirmed, then the token is
  cleared and Login is shown.
- **AC-7** — Given blank required fields, when submitting, then submit is
  blocked with field-level errors.

## 10. Out of Scope

- Token refresh (backend has no refresh endpoint; expiry = re-login).
- Forgot-password / email verification flows.
- Social login (AuthProvider exists in the backend but no endpoint is exposed).
