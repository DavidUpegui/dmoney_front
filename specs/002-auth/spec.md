# Feature: Authentication

- **Status:** `in-progress` (UI revision — native-restraint redesign)
- **Folder:** `002-auth`
- **Related area:** `auth`

## UI / UX Directives

Applies to every screen in this feature. Before writing UI code, load the skills
`frontend-design`, `expo-design-system`, `expo-native-ui`, `expo-ui`,
`expo-animation`, `vercel-react-native-skills` (and `web-design-guidelines` for
the web target), routing the work through `expo-overview`.

- **Tokens only** — every color, space, radius, type size, and motion value comes
  from `@/theme`; no hardcoded values in screens or components.
- **Spacing rhythm** — 4-pt grid; screens pad 20 horizontally; group related
  fields into inset sections; separate with `gap`, not ad-hoc margins.
- **Typography** — one system type scale; build hierarchy with weight and color
  before size; money uses tabular figures.
- **Native controls first** — reach for `@expo/ui` (sheets, pickers, switches,
  grouped rows, form sections) before RN built-ins or community libraries;
  native stack + `NativeTabs` for navigation; `Pressable` over Touchables.
- **Semantic color** — light/dark via `Color` from `expo-router`; income and
  outcome use their tokens.
- **Four states** — data screens implement loading / error / empty / content;
  empty states invite an action.
- **Motion** — user-triggered feedback only (press, reveal, confirm); animate
  transform/opacity; respect reduced motion; no decorative entrances.
- **Accessibility** — labelled fields and controls, roles, visible focus,
  contrast, Dynamic Type.
- **Copy** — sentence case, active voice, the user's vocabulary; errors state
  what happened and how to fix it.

### Direction: Native restraint

- **Type** — the system face (SF Pro / Roboto) at the `@/theme` scale; the
  `dmoney` wordmark sits at `largeTitle`; money uses tabular figures.
- **Color** — semantic tokens only; the accent is `primary` (system blue);
  `income`/`outcome` are reserved for amounts, never for chrome.
- **Structure** — inset grouped sections (not drop-shadowed cards); generous
  margins; hierarchy from weight and color, not many sizes.
- **Motion** — press feedback and error/success reveal only; reduced motion
  honored.

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
- **NFR-4** — UI/UX: Login/Register/Settings follow the UI / UX Directives —
  tokens only (no hardcoded color/space/type), screen padding 20, related fields
  grouped into inset sections, native controls/`Pressable`.
- **NFR-5** — Adaptivity: correct in light and dark mode and under Dynamic Type
  (no clipped labels); server-supplied text wraps.
- **NFR-6** — Motion: press feedback on submit/logout and a reveal for the
  inline banner; all motion respects reduced motion.

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

Layout follows the Native-restraint direction: a padded screen (20 px), a brand
block, one **inset grouped section** per form, and a single full-width primary
action. Hierarchy comes from weight and color, not many type sizes.

| Screen | Route | Layout | States & affordances |
|--------|-------|--------|----------------------|
| `Login` | `/login` | brand block → inset form section (Email, Password) → primary action → footer link | idle form; submitting → button disabled + spinner; error → inline banner with `message`; success → tabs |
| `Register` | `/register` | brand block → inset form section (Name, Email, Password) → primary action → footer link | same; success → navigate to Login with email prefilled + success banner |
| `Settings` | `/settings` | large title → inset section (signed-in context) → inset section (destructive row **Cerrar sesión**) | logout row; destructive styling; native confirm on native, immediate on web |

Components:

- Reused from 001-foundation: `<Screen>`, `<TextInput>` (labelled), `<Button>`,
  `<FormBanner>`, `<ThemedText>`.
- New (added to the design system in this feature): `<BrandMark>` (the `dmoney`
  wordmark), `<FormSection>` (inset grouped container), `<ListRow>` (inset row
  with optional chevron/destructive tone) used by Settings.
- Inputs and the button use a minimum touch height of 44 (button 52); the submit
  button is full width.

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
- **AC-8** — Given the auth screens, when audited, then no hardcoded
  color/space/type values appear outside `@/theme` (UI / UX Directives).
- **AC-9** — Given light and dark system themes, when opening Login, Register,
  and Settings, then each renders with the correct semantic tokens.
- **AC-10** — Given reduced motion is enabled, when submitting a form, then no
  non-essential animation plays while the loading/disabled state still shows.
- **AC-11** — Given a small display / large text size, when opening the forms,
  then labels, inputs, and errors do not clip or overlap.

## 10. Out of Scope

- Token refresh (backend has no refresh endpoint; expiry = re-login).
- Forgot-password / email verification flows.
- Social login (AuthProvider exists in the backend but no endpoint is exposed).
