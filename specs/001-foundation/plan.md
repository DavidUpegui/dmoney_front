# Plan: App Foundation

Break the spec into concrete work items, mapped to the Expo `src/` layout.

## Scaffold

- [x] `create-expo-app` with TypeScript + Expo Router (tabs template)
- [x] Add `@tanstack/react-query`, `expo-secure-store`
- [x] Configure `src/` directory and update `package.json` scripts
  (`lint`, `typecheck`, `test`)

## Routes (`src/app/...`)

- [x] `_layout.tsx` — QueryClientProvider + AuthProvider + auth gate (splash)
- [x] `(auth)/_layout.tsx`, `(auth)/login.tsx`, `(auth)/register.tsx`
  (placeholders)
- [x] `(tabs)/_layout.tsx` — four tabs with icons
- [x] `(tabs)/index.tsx`, `categories.tsx`, `tags.tsx`, `settings.tsx`
  (placeholders)

## Design system (`src/theme.ts`)

- [x] Semantic color tokens (light + dark), spacing, typography, radius, elevation
- [x] `formatAmount` utility (`src/utils/format.ts`)

## Components (`src/components/...`)

- [x] `Screen`, `Spinner`, `ErrorState`, `EmptyState`
- [x] `Button`, `IconButton`, `TextInput` (labelled field), `Card`

## Data fetching (`src/lib/api/`, `src/hooks/...`)

- [x] API client (base URL, bearer header, JSON, typed `ApiError`)
- [x] `tokenStore` (SecureStore-backed)
- [x] QueryClient configuration + `QueryClientProvider`

## Types & constants (`src/types/`, `src/constants.ts`)

- [x] `ApiError`, `CategoryType`, `MovementType`, `TokenStore`
- [x] `API_BASE_URL`, currency constants

## Tests (colocated `*.test.ts(x)`)

- [x] API client (headers, error parsing)
- [x] `formatAmount`
- [x] Theme token resolution (light/dark)
- [x] `tokenStore` (with mocked SecureStore)

## Verification

- [x] `npx tsc --noEmit`
- [x] `npx expo lint`
- [x] `npm test`
