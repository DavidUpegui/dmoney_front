# Plan: Authentication

## Routes (`src/app/...`)

- [x] `(auth)/login.tsx` and `(auth)/register.tsx` real screens
- [x] `_layout.tsx` auth gate (splash → `(auth)` | `(tabs)`)
- [x] `(tabs)/settings.tsx` logout button

## Components (`src/components/...`)

- [x] Reuse `TextInput`, `Button`; add `FormBanner` (inline error/success)
- [x] Add `BrandMark`, `FormSection`, `ListRow` (design-system pieces)

## UI / design (skills-based, Native restraint)

- [x] Extend `src/theme.ts` with spacing/control-height/grouping/motion tokens
- [x] Restyle `Screen` (padding 20), `TextInput` (grouped field), `Button`
      (touch height, press feedback) — tokens only
- [x] Rebuild `Login`/`Register` around brand block + inset form section
- [x] Rebuild `Settings` as inset grouped rows (context row + destructive logout)
- [x] Motion: press feedback + banner reveal; respect reduced motion

## Data fetching & state (`src/lib/...`)

- [x] `useLogin` mutation (stores token via `tokenStore` + `signIn`)
- [x] `useRegister` mutation
- [x] Auth/session context (`AuthProvider`, `useAuth`) + `tokenStore`
- [x] Global 401 interceptor (`setUnauthorizedHandler` in `api/client.ts`,
      wired in `AuthProvider`)

## Types & utils (`src/types/`, `src/utils/`)

- [x] `LoginRequest/Response`, `RegisterRequest/Response`
- [x] `auth-validation` (email/password/name) + `error-message` mapping

## Tests (colocated `*.test.ts(x)`)

- [x] Login/Register form validation
- [x] `useLogin`/`useRegister` mutation behavior (mock API)
- [x] Session hydration / gate state (mock token store)
- [x] 401 → clear session
- [x] Logout clears session

## Verification

- [x] `npx tsc --noEmit`
- [x] `npx expo lint`
- [x] `npm test`
- [ ] Visual check in light/dark + reduced motion (mobile + web)
