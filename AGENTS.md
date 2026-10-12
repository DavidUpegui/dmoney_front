# AGENTS.md

## Project Overview

`dmoney` is a personal finances application. This repository contains the **front-end** (`dmoney_front`), built with **Expo** and **React Native**.

## Tech Stack

- **Framework**: Expo (React Native), SDK 57
- **Language**: TypeScript
- **State management**: TanStack React Query (server state) + React context (auth)
- **Navigation**: Expo Router (NativeTabs on native, JS tabs on web)
- **Storage**: `expo-secure-store` (JWT)

## Repository

- **Remote**: `git@github.com:DavidUpegui/dmoney_front.git` (SSH)
- **Branching**: Trunk-based development; default branch is `trunk`.

## Expo Skills

The Expo skills library is installed under `.agents/skills/`. When working on Expo-related
tasks (routing, data fetching, EAS, upgrades, etc.), load the relevant skill before making changes.
Route every Expo/EAS task through `expo-overview` first to detect the SDK version and the right
leaf skill.

## Spec-Driven Development

Development is **spec-first**: no code without a spec. Feature specs live in `specs/`
(`spec.md` → `plan.md` → `tasks.md`), split by vertical slice. Use the `spec-writer` skill
(`.opencode/skills/spec-writer/SKILL.md`) to write, revise, or scaffold specs.

## Project Structure

```
src/
  app/            # Expo Router routes ONLY (every file is a route)
    _layout.tsx   # root: providers + auth gate
    (auth)/       # login/register (002-auth)
    (tabs)/       # four-tab shell
  components/     # reusable UI (kebab-case files, one named export each)
  lib/            # api client, token store, auth context, query client
  types/          # shared types (ApiError, CategoryType, MovementType, TokenStore)
  utils/          # formatAmount + colocated tests
  theme.ts        # design tokens (colors, spacing, typography, radius, shadows)
  constants.ts    # API_BASE_URL, CURRENCY
```

- `@/*` aliases to `src/*` (see `tsconfig.json`).
- Route files stay thin; screen bodies and shared pieces live in `components/` / `lib/`.

## Development Conventions

- **Run**: `npm start` (Expo Go) · `npm run web` (Expo Web) · `npm run ios` / `npm run android`
- **Lint**: `npm run lint` (`expo lint`) · **Typecheck**: `npm run typecheck` (`tsc --noEmit`)
- **Test**: `npm test` (jest-expo); tests are colocated (`*.test.ts(x)` next to the source)
- **Install deps**: `npx expo install <pkg>` (never raw `npm add` for Expo packages)
- **Naming**: kebab-case files; one named export per component; styles colocated via `StyleSheet.create`
- **Styling**: tokens from `@/theme` only — no hardcoded colors/spacing/font sizes in screens
- **Data screens** implement four states: loading, error, empty, content

## Notes

- The back-end is a separate repository/concern; the shared HTTP contract lives in
  the root `API_CONTRACT.md`.
