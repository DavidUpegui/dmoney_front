# Feature: Movements

- **Status:** `draft`
- **Folder:** `005-movements`
- **Related area:** `tracker`

## 1. Overview

The core of the app: create, list (with filters), edit, and delete movements.
A movement ties an amount, a category (and optional subcategory), a type
(`INCOME` | `OUTCOME` | `TRANSFER`), an optional description, a date, and a set
of tags. The list is the home tab and supports filtering by category,
subcategory, tags, type, date range, and free-text search.

Actors: the authenticated user, reviewing and recording their money flows.

## 2. Requirements

### Functional (FR)

- **FR-1** — List movements (`GET /api/movements`) as the home tab, showing
  amount (signed by type), category/subcategory name, date, and tags.
- **FR-2** — Filter the list by `categoryIds`, `subcategoryIds`, `tagIds`
  (repeatable), `type`, `dateFrom`, `dateTo`, and `search` (free-text on
  description).
- **FR-3** — Create a movement (`POST /api/movements`) with required
  `categoryId`, `subcategoryId`, `amount` (> 0), `type`, `date`; optional
  `description` (≤ 500) and `tagIds`.
- **FR-4** — Edit a movement (`PATCH /api/movements/{id}`); all fields
  optional, only provided fields update.
- **FR-5** — Delete a movement (`DELETE /api/movements/{id}`) after
  confirmation.
- **FR-6** — Category/subcategory pickers are populated from
  `useCategories`/`useSubcategories`; tag picker from `useTags`.
- **FR-7** — Mutations invalidate the movements list so the home tab stays
  current.

### Non-functional (NFR)

- **NFR-1** — The list implements the four states (loading/error/empty/content).
- **NFR-2** — Amount is always shown via `formatAmount` (COP).
- **NFR-3** — Filter state is local UI state (not persisted server-side).
- **NFR-4** — Accessibility: sortable/filterable list is reachable and readable.

## 3. Navigation & Routes

```
src/app/
  (tabs)/
    index.tsx                          # / — movements list + filter bar + FAB
  movements/
    new.tsx                            # /movements/new — create (modal)
    [id].tsx                           # /movements/[id] — detail (optional)
    [id]/edit.tsx                      # /movements/[id]/edit — edit (modal)
```

- The movements list is the home tab (`/`).
- Create/edit present as modal sheets with a full form (category →
  subcategory → type → amount → date → description → tags).

## 4. Screens & UI

| Screen | Route | States & affordances |
|--------|-------|----------------------|
| `MovementList` | `/` | loading → spinner; empty → "Sin movimientos" + Create; error → retry; content → grouped-by-date list |
| `MovementForm` | `/movements/new`, `[id]/edit` | cascading category→subcategory; inline validation; save disabled while pending |
| `MovementDetail` | `/movements/[id]` | shows full movement; edit/delete actions (optional slice) |

Reusable: `Card`, `Button`, `TextInput`, `EmptyState`, `ErrorState`, `Spinner`,
`FilterBar`, `TypeBadge`, `AmountText`.

## 5. Data Fetching & API

| Method | Path | Query / Mutation | Cache key |
|--------|------|------------------|-----------|
| `GET` | `/api/movements` | `useMovements` | `['movements', filters]` |
| `GET` | `/api/movements/{id}` | `useMovement` | `['movements', id]` |
| `POST` | `/api/movements` | `useCreateMovement` | invalidates `['movements']` |
| `PATCH` | `/api/movements/{id}` | `useEditMovement` | invalidates `['movements']`, `['movements', id]` |
| `DELETE` | `/api/movements/{id}` | `useDeleteMovement` | invalidates `['movements']` |

Filter params map to query-string arrays (`?categoryIds=a&categoryIds=b`) and
single values (`type`, `dateFrom`, `dateTo`, `search`).

### Request / Response examples

```json
POST /api/movements
{
  "categoryId": "uuid",
  "subcategoryId": "uuid",
  "amount": 42.5,
  "type": "OUTCOME",
  "description": "Lunch",
  "date": "2026-10-08",
  "tagIds": ["uuid"]
}
→ 201 (Location: /api/movements/{id})
{
  "movementId": "uuid", "categoryId": "uuid", "subcategoryId": "uuid",
  "amount": 42.5, "type": "OUTCOME", "description": "Lunch",
  "date": "2026-10-08", "tagIds": ["uuid"]
}
```

```json
PATCH /api/movements/{id}
{ "amount": 50.0, "description": "Dinner" }
→ 200 { "...": "updated movement" }
```

> **Field note:** requests and responses both use `tagIds` for the tag
> identifier list.

### Status code → UI mapping

- `200/201` — content / success
- `204` — deleted → refresh list
- `400` — validation error (bad enum/ID, amount ≤ 0) → inline `message`
- `401` — redirect to login (global)
- `404` — movement/category/tag not found or belongs to another user → error
- `5xx` — retryable error

## 6. Data Model

```ts
type Movement = {
  movementId: string;
  categoryId: string;
  subcategoryId: string;
  amount: number;          // positive decimal
  type: MovementType;      // 'INCOME' | 'OUTCOME' | 'TRANSFER'
  description: string;     // ≤ 500 chars
  date: string;            // 'yyyy-MM-dd'
  tagIds: string[];
};

type CreateMovementRequest = {
  categoryId: string;
  subcategoryId: string;
  amount: number;
  type: MovementType;
  description?: string;
  date: string;
  tagIds?: string[];
};

type EditMovementRequest = Partial<CreateMovementRequest>;

type MovementFilters = {
  categoryIds?: string[];
  subcategoryIds?: string[];
  tagIds?: string[];
  type?: MovementType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};
```

## 7. Business Rules & Validation

- **BR-1** — `amount` must be a positive number (> 0).
- **BR-2** — `type` is one of `INCOME` | `OUTCOME` | `TRANSFER`.
- **BR-3** — `description` ≤ 500 chars.
- **BR-4** — `date` is `yyyy-MM-dd`.
- **BR-5** — A movement requires a valid `categoryId`; `subcategoryId` must
  belong to that category (backend enforces; client mirrors by only offering
  that category's subcategories).
- **BR-6** — Selected tags must be the user's own tags.
- **BR-7** — Category type (`INCOME`/`OUTCOME`) and movement type may differ
  only for `TRANSFER` (no account concept; see Out of Scope).
- **BR-8** — Filters combine with AND semantics; `search` matches description.
- **BR-9** — Outgoing amounts display negatively (`- $ 12.500`), income
  positively, in the list.

## 8. Edge Cases

- Empty movement list → empty state with Create action.
- No subcategories for a category → allow movement without subcategory (or
  show a hint) — surface backend error if it rejects.
- Amount `0` or negative → client-side validation blocks submit.
- Invalid category/subcategory/tag ID (deleted since) → backend `404`/`400`,
  shown inline.
- Rapid double-tap on save → disabled while pending.
- Filter yields no results → "Sin resultados" empty state with clear-filters.

## 9. Acceptance Criteria

- **AC-1** — Given movements exist, when opening `/`, then they are listed
  with amount, type, date, and category.
- **AC-2** — Given no movements, when opening `/`, then an empty state with a
  Create action is shown.
- **AC-3** — Given a valid create form, when submitted, then `201` is returned
  and the list refreshes to include it.
- **AC-4** — Given an amount ≤ 0, when submitting, then it is rejected
  client-side.
- **AC-5** — Given a filter (e.g. `type=OUTCOME`), when applied, then only
  matching movements are shown.
- **AC-6** — Given a date range filter, when applied, then movements within
  the inclusive range are shown.
- **AC-7** — Given a `search` term, when applied, then only movements whose
  description matches are shown.
- **AC-8** — Given an edit form, when a field changes and saves, then `PATCH`
  updates it and the list reflects it.
- **AC-9** — Given a delete confirmation, when confirmed, then `204` is
  returned and the movement disappears.

## 10. Out of Scope

- **TRANSFER semantics**: there is no account/transfer-source concept in the
  backend; `TRANSFER` is treated as a plain type label. Real transfers are
  deferred.
- Movement detail screen is optional (list + edit can satisfy the CRUD need).
- Sorting/pagination (backend returns the full list; no `sort`/`page` params).
- Charts/reports/summaries.
