# Plan: Design Refresh — "Tinta"

Maps the spec onto the Expo `src/` layout. Tick items in `tasks.md`.

## Theme foundation (`src/theme.ts`, `src/lib/theme.tsx`)

- [ ] `lightColors` / `darkColors` token sets + `ColorTokens` type
- [ ] Non-color tokens: `spacing`, `radius`, `shadows`, `layout`, `control`,
      `motion`, `type` (color-free, incl. `numeric`)
- [ ] `ThemeProvider`, `useColors`, `useThemedStyles`, `useTheme` (light fallback)

## Routes / root (`src/app/_layout.tsx`)

- [ ] Mount `ThemeProvider`; map navigation theme + status bar to tokens

## Components (`src/components/...`)

- [ ] `ThemedText` gains `tone`
- [ ] Restyle primitives: Screen, Button, ListRow, TextInput, FormSection,
      FormBanner, Card, Chip, ChipGroup, SegmentedControl, TypeBadge,
      AmountText, MovementRow, EmptyState, ErrorState, Spinner, IconButton,
      BrandMark
- [ ] New: `DayHeader`, `BalanceSummary`, `FilterSheet`

## Screens (`src/app/...`)

- [ ] Movements home: persistent search, filter sheet + badge, day net, rows
- [ ] Categories / Tags / Settings restyled; English copy
- [ ] Create/edit screens (category, subcategory, tag, movement) restyled
- [ ] Auth (login/register) restyled

## Config

- [ ] `app.json` splash + Android adaptive background colors

## Tests (colocated `*.test.ts(x)`)

- [ ] Update `theme.test.ts` to the new contract
- [ ] Add a small `useColors` / net-computation test if practical

## Verification

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] Visual check on web (and iOS/Android if available)
