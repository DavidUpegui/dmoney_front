# Tasks: Authentication

## FAUTH01 — Login submits credentials
- [x] `useLogin` + `POST /auth/login` (`lib`)
- [x] Login form with email and password (`app`)
- [x] **Validado** — `fauth01_*` (2 tests)

## FAUTH02 — Valid login stores the token
- [x] `AuthProvider` stores the token in `tokenStore` (`lib`)
- [x] The auth gate routes to the tabs (`app`)
- [x] **Validado** — `fauth02_*` (1 tests)

## FAUTH03 — Invalid credentials inline
- [x] `401` mapped to the form banner (`app`)
- [x] No token stored on failure (`lib`)
- [x] **Validado** — `fauth03_*` (2 tests)

## FAUTH04 — Register submits and handles 409
- [x] `useRegister` + `POST /auth/register` (`lib`)
- [x] Register form (`app`)
- [x] `409` inline (`app`)
- [x] **Validado** — `fauth04_*` (4 tests)

## FAUTH05 — Client validation mirrors the back-end
- [x] Email format/max 255, password min 8, name max 100 (`utils`)
- [x] Submit disabled while pending (`components`)
- [x] **Validado** — `fauth05_*` (13 tests)

## FAUTH06 — Register returns to login
- [x] Redirect with the email prefilled and a success banner (`app`)
- [x] **Validado** — `fauth06_*` (2 tests)

## FAUTH07 — Session hydration
- [x] `AuthProvider` restores the persisted token and exposes `isLoading` (`lib`)
- [x] Root gate shows a splash while hydrating (`app`)
- [x] **Validado** — `fauth07_*` (3 tests)

## FAUTH08 — Logout
- [x] Confirmation then `signOut` (`app`)
- [x] Token cleared and login shown (`lib`)
- [x] **Validado** — `fauth08_*` (2 tests)

