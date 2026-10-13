# Feature: <Feature Name>

- **Status:** `draft`
- **Folder:** `NNN-<feature-name>`
- **Related area:** `tracker` | `auth`

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

## 1. Overview

A short paragraph describing what this feature does and why it exists. Who are
the actors, and what problem does it solve?

## 2. Requirements

### Functional (FR)

- **FR-1** — Description of a required capability.
- **FR-2** — ...

### Non-functional (NFR)

- **NFR-1** — Security: protected routes redirect unauthenticated users to login.
- **NFR-2** — Performance / accessibility / offline behavior.

## 3. Navigation & Routes

Expo Router file tree under `src/app/`:

```
src/app/
  _layout.tsx          # root layout (hydration gate, auth provider)
  index.tsx
  <resource>/index.tsx
  <resource>/[id].tsx
```

Route params, groups, and which layout owns the stack/tabs. Any deep links or
platform-specific routing.

## 4. Screens & UI

Per the UI / UX Directives above: real margins (screen padding 20), related
fields/rows grouped into inset sections, native controls (`@expo/ui`), and
restrained motion for user-triggered feedback.

| Screen | Route | Layout | States & affordances |
|--------|-------|--------|----------------------|
| `<X>List` | `/x` | padded screen; inset grouped rows | loading → spinner; empty → "No items" + Create; error → retry; content → rows |

List the reusable components under `src/components/` if any, noting which are
new (and added to the design system) vs. reused from 001-foundation.

## 5. Data Fetching & API

React Query hooks (query/mutation, keys, cache behavior) and the consumed
endpoints:

| Method | Path | Query / Mutation | Cache key |
|--------|------|------------------|-----------|
| `GET`  | `/api/x` | `useXList` | `['x']` |

### Request / Response examples

```json
GET /api/x
{ "items": [ { "id": "..." } ] }
```

### Status code → UI mapping

- `200` — content
- `401` — redirect to login
- `404` — empty / not-found state
- `5xx` — retryable error

## 6. Data Model

Local TypeScript types and their constraints.

```ts
type X = { id: string; /* ... */ };
```

## 7. Business Rules & Validation

- Rules stated as testable statements.
- Form validation: required fields, formats, client-vs-server errors.

## 8. Edge Cases

- Empty / null inputs.
- Offline or slow network.
- Duplicate / repeat submits (disable while pending).
- Hydration timing (redirect only after persisted auth state loads).

## 9. Acceptance Criteria

Each criterion maps to a test.

- **AC-1** — Given X, when Y, then Z.

## 10. Out of Scope

- Things deliberately not included in this feature.
