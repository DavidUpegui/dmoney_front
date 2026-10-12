# Plan: Authentication

## Routes (`src/app/...`)

- [ ] `(auth)/login.tsx` and `(auth)/register.tsx` real screens
- [ ] `_layout.tsx` auth gate (splash → `(auth)` | `(tabs)`)
- [ ] `(tabs)/settings.tsx` logout button

## Screens (`src/screens/...`)

- [ ] `LoginScreen` (form, validation, submitting state)
- [ ] `RegisterScreen` (form, validation, submitting state)
- [ ] `SettingsScreen` (logout)

## Components (`src/components/...`)

- [ ] Reuse `TextInput`, `Button`, error banner from 001-foundation

## Data fetching (`src/hooks/...`, `src/lib/api/...`)

- [ ] `useLogin` mutation (stores token, invalidates session)
- [ ] `useRegister` mutation
- [ ] Auth/session context (`AuthProvider`, `useAuth`) + `tokenStore`
- [ ] Global 401 interceptor → clear token + redirect

## Types & constants (`src/types/`, `src/constants.ts`)

- [ ] `LoginRequest/Response`, `RegisterRequest/Response`, session type

## Tests (colocated `*.test.ts(x)`)

- [ ] Login/Register form validation
- [ ] `useLogin`/`useRegister` mutation behavior (mock API)
- [ ] Auth gate routing (mock token store)
- [ ] 401 → clear + redirect

## Verification

- [ ] `npx tsc --noEmit`
- [ ] `npx expo lint`
- [ ] `npm test`
