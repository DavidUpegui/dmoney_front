# Authentication

Register, login, session persistence and logout. The JWT is the only credential
carried between requests; on launch the app restores it and gates the tabs.

## UI / UX Directives (temporary)

> These directives will move to `docs/ui.md` in a later pass. Until then they
> stay here and are not duplicated in other specs.

- **Tokens only** — every color, space, radius, type size and motion value comes
  from `@/theme`; no hardcoded values in screens or components.
- **Spacing rhythm** — 4-pt grid; screens pad 20 horizontally; group related
  fields into inset sections; separate with `gap`.
- **Typography** — one system type scale; hierarchy from weight and color.
- **Native controls first** — `Pressable` over Touchables; native sheets and
  stack.
- **Four states** — data screens implement loading / error / empty / content.
- **Motion** — user-triggered feedback only; respect reduced motion.
- **Accessibility** — labelled fields and controls, roles, visible focus,
  contrast, Dynamic Type.
- **Copy** — sentence case, active voice; errors state what happened and how to
  fix it.

## Requirements

- **FAUTH01** — The login screen collects email and password and calls
  `POST /auth/login`.
- **FAUTH02** — Valid credentials store the JWT and the app navigates to the
  tabs.
- **FAUTH03** — Invalid credentials (`401`) show the server message inline and
  do not store a token.
- **FAUTH04** — The register screen collects name, email and password, calls
  `POST /auth/register`, and shows a `409` inline when the email is taken.
- **FAUTH05** — Client validation mirrors the back-end: email format and max
  255, password at least 8 characters, name max 100; the submit button is
  disabled while the request is pending.
- **FAUTH06** — A successful registration returns to login with the email
  prefilled and a success banner.
- **FAUTH07** — On launch the app restores a persisted session and exposes a
  loading state while hydrating, so login/tabs do not flash.
- **FAUTH08** — Logout asks for confirmation, clears the token and returns to
  login.

`FSYS02` covers the global `401` handler; it is not repeated here.

## Routes & Screens

| Screen | Route | States |
|--------|-------|--------|
| `Login` | `/login` | idle, submitting, server error, success banner |
| `Register` | `/register` | idle, submitting, server error |
| `Settings` | `/settings` | idle, confirming logout |

- The root layout is the auth gate: splash while hydrating, then `(tabs)` if a
  token exists or `(auth)` otherwise.
- Login and Register link to each other; successful registration returns to
  login with the email prefilled.

## API Consumption

| Method | Path | Req | Hook |
|--------|------|-----|------|
| `POST` | `/auth/login` | FAUTH01, FAUTH02, FAUTH03 | `useLogin` |
| `POST` | `/auth/register` | FAUTH04, FAUTH05, FAUTH06 | `useRegister` |

### Status → UI

- `200` (login) — store token, navigate to tabs
- `201` (register) — return to login with success banner
- `400` — inline validation message
- `401` — inline “invalid credentials”
- `409` — inline “email already registered”
- `5xx` — retryable error banner

## Local model

```ts
type LoginRequest = { email: string; password: string };
type LoginResponse = { token: string };
type RegisterRequest = { email: string; password: string; name: string };
type RegisterResponse = { userId: string };
```

Session state: `{ token: string } | null`, hydrated from `tokenStore`.

## Out of Scope

- Token refresh, forgot-password and email verification.
- Social login.
- Visual polish and manual cross-device checks; deferred to the `docs/ui.md`
  pass.
