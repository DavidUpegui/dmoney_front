# Feature: Design Refresh — "Tinta"

- **Status:** `implemented`
- **Folder:** `006-design-refresh`
- **Related area:** `tracker` | `auth` (shared)

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
  before size; money uses tabular figures (the `numeric` variant).
- **Native controls first** — reach for `@expo/ui` (sheets, pickers, switches,
  grouped rows, form sections) before RN built-ins or community libraries;
  native stack + `NativeTabs` for navigation; `Pressable` over Touchables.
- **Semantic color** — a bespoke light/dark palette exposed through
  `useColors()`; income, outcome, and transfer use their tokens.
- **Four states** — data screens implement loading / error / empty / content;
  empty states invite an action.
- **Motion** — user-triggered feedback only (press, reveal, confirm); animate
  transform/opacity; respect reduced motion; no decorative entrances.
- **Accessibility** — labelled fields and controls, roles, visible focus,
  contrast, Dynamic Type.
- **Copy** — English, sentence case, active voice, the user's vocabulary;
  errors state what happened and how to fix it.

## 1. Overview

Replaces the generic, iOS-system-colored "SaaS card kit" with a deliberate
visual identity — **Tinta**, a precise, calm ledger — without changing any
feature's functionality. Money is the content, so amounts lead and everything
around them recedes. Identity is carried by a bespoke light/dark palette
(petrol-teal primary, ledger ink, stamped red), a numeric typographic
treatment, and a disciplined hairline/spacing rhythm instead of repeated
soft-shadowed cards.

Actors: the authenticated `dmoney` user. The refresh touches every screen but
adds no backend or data behavior.

## 2. Requirements

### Functional (FR)

- **FR-1** — `src/theme.ts` exposes `lightColors` and `darkColors` token sets
  (`ColorTokens`) plus non-color tokens (`spacing`, `radius`, `shadows`,
  `layout`, `control`, `motion`, `type`). `type` carries no color; it defines
  size/weight/line-height/letter-spacing only and includes a `numeric` variant
  with tabular figures.
- **FR-2** — A `ThemeProvider` + `useColors()` / `useThemedStyles()` (in
  `src/lib/theme.tsx`) resolve the palette from `useColorScheme()`, defaulting
  to light. Rendering outside the provider falls back to the light palette
  (never throws).
- **FR-3** — `ThemedText` gains a `tone` prop (`default | secondary | faint |
  primary | income | outcome | transfer | danger | onPrimary`) mapped to color
  tokens; the default tone is `ink`.
- **FR-4** — The root layout mounts `ThemeProvider`, maps the Expo Router
  navigation theme (light/dark) to the tokens, and sets the status bar style to
  the active scheme.
- **FR-5** — Every shared component in `src/components/` consumes the palette
  via `useColors()`/`useThemedStyles()`; no component reads colors statically.
- **FR-6** — The Movements home tab is restructured: persistent search field; a
  **Filters** trigger with an active-count badge opening a bottom sheet
  (type / categories / tags / date range); day sections with a per-day **net**
  figure; amount-led rows with a small income/outcome/transfer marker.
- **FR-7** — Filters move from an always-expanded card into the sheet; applying
  or clearing filters preserves the existing combined filter semantics.
- **FR-8** — UI copy is unified to English (e.g. `Sign out`).

### Non-functional (NFR)

- **NFR-1** — Accessibility: text/background contrast meets WCAG AA in both
  schemes; every interactive control keeps its accessibility role/label/state.
- **NFR-2** — Motion stays user-triggered only, respects reduced motion, and
  animates transform/opacity only.
- **NFR-3** — Maintainability: all colors/spacing/type/motion values live in
  `@/theme`; screens contain no hardcoded visual values.
- **NFR-4** — Dark mode is fully supported on native and web (no light-only
  regressions).

## 3. Navigation & Routes

No routes change. The refresh reskins existing routes:

```
src/app/
  _layout.tsx                          # + ThemeProvider, nav theme, status bar
  (auth)/login.tsx | register.tsx
  (tabs)/index.tsx | categories.tsx | tags.tsx | settings.tsx
  categories/... | tags/... | movements/...
```

## 4. Screens & UI

| Screen | Route | Changes |
|--------|-------|---------|
| `MovementList` | `/` | persistent search; filter sheet trigger + badge; day header with net; amount-led rows; primary add action |
| `MovementForm` | `/movements/new`, `[id]/edit` | emphasized numeric amount field; clearer cascade; full-width submit |
| `CategoryList` / `TagList` | `/categories`, `/tags` | restyled headers/rows/badges |
| `Settings` | `/settings` | restyled; English copy (`Sign out`) |
| auth | `/(auth)/*` | refined brand mark and form |

New components added to the design system: `BalanceSummary` (day net),
`FilterSheet`, `SearchField`, `FilterButton`. The old always-expanded
`FilterBar` is removed. Reused/restyled: `Screen`, `ThemedText`, `Button`,
`ListRow`, `TextInput`, `FormSection`, `FormBanner`, `Card`, `Chip`,
`ChipGroup`, `SegmentedControl`, `TypeBadge`, `AmountText`, `MovementRow`,
`EmptyState`, `ErrorState`, `Spinner`, `IconButton`, `BrandMark`.

> **Deviation:** the filter sheet is a cross-platform RN `Modal` (works on web
> and native) rather than `@expo/ui`'s native-only `BottomSheet`, so the web
> target keeps the same UX. Native-feeling controls (segmented control, chips,
> text fields) are used inside it.

## 5. Data Fetching & API

No changes. The refresh reuses `useMovements`, `useCategories`, `useTags`,
`useSubcategories`, and the existing mutations; cache keys and filter semantics
are untouched. The day "net" is computed client-side from the already-loaded
movement list.

## 6. Data Model

No new domain types. The palette adds a UI-only type:

```ts
type ColorTokens = {
  canvas; surface; raised; sunken;
  ink; inkSecondary; inkFaint; hairline;
  primary; primaryPressed; onPrimary; primarySurface;
  income; outcome; transfer; danger;
};
```

## 7. Business Rules & Validation

- **BR-1** — Day net = sum of income/outcome for that date (transfer excluded
  from the net, matching the movement type semantics); displayed with the same
  sign/color rules as rows.
- **BR-2** — The active-filter count counts each non-empty filter dimension
  (search, type, categories, tags, from, to).
- **BR-3** — Amounts always render through `formatAmount` with tabular figures.

## 8. Edge Cases

- No provider mounted (tests/storybook) → light palette fallback.
- Filter sheet opened on web → sheet renders as an overlay without crashing.
- `useColorScheme()` returns `null` → treat as light.
- Very long category/description → row text truncates; amount column stays
  aligned.

## 9. Acceptance Criteria

- **AC-1** — Given light or dark system theme, when any screen renders, then the
  correct palette tokens are applied (no hardcoded colors).
- **AC-2** — Given the movements list, when a day has movements, then the day
  header shows the localized date and the day net.
- **AC-3** — Given filters applied, when the list renders, then only matching
  movements show and the filter badge reflects the active count.
- **AC-4** — Given `formatAmount(12500)`, then the numeric variant renders
  `$ 12.500` with tabular figures.
- **AC-5** — Given the settings screen, then the destructive action reads
  `Sign out`.

## 10. Out of Scope

- Regenerating icon/splash artwork (only splash/adaptive background colors are
  updated).
- New backend endpoints or data behavior.
- Charts/reports/summaries beyond the per-day net.
