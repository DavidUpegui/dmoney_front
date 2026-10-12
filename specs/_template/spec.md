# Feature: <Feature Name>

- **Status:** `draft`
- **Folder:** `NNN-<feature-name>`
- **Related area:** `tracker` | `auth`

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

| Screen | Route | States & affordances |
|--------|-------|----------------------|
| `<X>List` | `/x` | loading → spinner; empty → "No items" + Create; error → retry |

List the reusable components under `src/components/` if any.

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
