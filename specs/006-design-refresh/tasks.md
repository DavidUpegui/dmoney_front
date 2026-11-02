# Tasks: Design Refresh — "Tinta"

Checklist of work items. Mark `[x]` when done.

## Spec
- [x] `spec.md` written and reviewed

## Theme
- [x] `src/theme.ts` rewritten (light/dark palettes, type + numeric)
- [x] `src/lib/theme.tsx` provider hooks
- [x] Root layout mounts provider + nav theme + status bar

## Components
- [x] Primitives refactored to `useColors()` / `useThemedStyles()`
- [x] New `BalanceSummary`, `FilterSheet`, `SearchField`, `FilterButton`

## Screens
- [x] Movements home (search, filter sheet, day net, rows)
- [x] Categories / Tags / Settings
- [x] Category / subcategory / tag / movement forms
- [x] Auth login / register

## Config
- [x] `app.json` splash + adaptive colors

## Tests
- [x] `theme.test.ts` updated
- [x] `movement-filters.test.ts` added
- [x] Remaining tests pass

## Verification
- [x] `npm run typecheck` passes
- [x] `npm run lint` passes
- [x] `npm test` (jest-expo) passes
- [x] Web export builds (`expo export --platform web`)
