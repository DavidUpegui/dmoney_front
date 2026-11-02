# Tasks: Foundation

## FFOUND01 — Secure token storage
- [x] `tokenStore` over `expo-secure-store` (`lib`)
- [x] Storage failure behaves as logged out (`lib`)
- [x] **Validado** — `ffound01_*` (4 tests)

## FFOUND02 — Typed API client
- [x] JSON + base URL + Bearer header (`lib`)
- [x] `ApiError` for non-2xx and network failures; `204` → undefined (`lib`)
- [x] **Validado** — `ffound02_*` (5 tests)

## FFOUND03 — Global QueryClient
- [x] `staleTime` 5 minutes and `retry` 2 (`lib`)
- [x] Provided at the root (`app`)
- [x] **Validado** — `ffound03_*` (1 tests)

## FFOUND04 — Design tokens
- [x] Light/dark palettes, spacing, typography, radius, motion (`theme`)
- [x] **Validado** — `ffound04_*` (6 tests)

## FFOUND05 — Root shell and tabs
- [x] Providers, auth gate and four tabs (`app`, `components`)
- [x] **Validado** — `ffound05_*` (1 tests)

## FFOUND06 — Amount formatting
- [x] `formatAmount` with COP and zero decimals (`utils`)
- [x] **Validado** — `ffound06_*` (2 tests)
