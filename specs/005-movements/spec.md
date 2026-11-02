# Movements

A movement is a financial transaction owned by the user: amount, type, category,
subcategory, date, optional description and tags. The home tab lists them and
the form sheets create/edit/delete them.

## UI / UX Directives (temporary)

> These directives will move to `docs/ui.md` in a later pass. Until then they
> stay here and are not duplicated in other specs.

- **Tokens only** — every color, space, radius, type size and motion value comes
  from `@/theme`; no hardcoded values.
- **Spacing rhythm** — 4-pt grid; screens pad 20; inset grouped sections.
- **Typography** — one scale; hierarchy from weight and color; money uses
  tabular figures.
- **Native controls first** — `Pressable` over Touchables; form sheets.
- **Four states** — collection screens implement loading / error / empty /
  content.
- **Motion** — user-triggered feedback only; respect reduced motion.
- **Accessibility** — labelled fields and controls; readable errors.
- **Copy** — sentence case, active voice; errors state what happened.

## Requirements

- **FMOV01** — The home tab lists the user's movements grouped by date, with
  amount, category/subcategory and tags.
- **FMOV02** — When there are no movements, the list shows an empty state with a
  create action; with active filters it shows “No matching movements”.
- **FMOV03** — The list can be filtered by categories, subcategories, tags,
  type, inclusive date range and description search.
- **FMOV04** — The filter sheet applies and clears filters, and the list
  refreshes with the new filters.
- **FMOV05** — A movement can be created with type, category, subcategory,
  amount, date, optional description and tags; invalid input is inline and the
  submit is disabled while pending.
- **FMOV06** — A movement can be edited; the form is prefilled, only the fields
  present change, and the list/detail refresh.
- **FMOV07** — Deleting a movement asks for confirmation, removes it and
  refreshes the list.
- **FMOV08** — Mutations invalidate the list and the movement detail.
- **FMOV09** — API errors are shown inline with the server message.
- **FMOV10** — The header opens the create sheet and a row opens the edit sheet.
- **FMOV11** — Amounts are rendered with `formatAmount` (COP, tabular figures,
  signed by type).

`FSYS01`, `FSYS02` and `FSYS03` cover the four states, the 401 redirect and the
server message; they are not repeated here.

## Routes & Screens

| Screen | Route | States |
|--------|-------|--------|
| `MovementList` | `/` | loading, error, empty, content |
| `MovementForm` (create) | `/movements/new` | form, pending, server error |
| `MovementForm` (edit) | `/movements/[id]/edit` | loading, error, form, pending, server error |

- The home tab groups movements by date, newest first, with a day balance.
- The list resolves category/subcategory/tag names client-side from the
  corresponding queries.
- Create/edit are form sheets; delete lives on the edit sheet behind a
  confirmation.

## API Consumption

| Method | Path | Req | Hook | Cache key |
|--------|------|-----|------|-----------|
| `GET` | `/api/movements` | FMOV01, FMOV03 | `useMovements` | `['movements', filters]` |
| `GET` | `/api/movements/{id}` | FMOV06 | `useMovement` | `['movements', id]` |
| `POST` | `/api/movements` | FMOV05 | `useCreateMovement` | invalidates `['movements']` |
| `PATCH` | `/api/movements/{id}` | FMOV06 | `useEditMovement` | invalidates `['movements']`, `['movements', id]` |
| `DELETE` | `/api/movements/{id}` | FMOV07 | `useDeleteMovement` | removes detail, invalidates list |

Filter params map to query-string arrays (`?categoryIds=a&categoryIds=b`) and
single values (`type`, `dateFrom`, `dateTo`, `search`).

### Status → UI

- `200/201` — content / success
- `204` — deleted, refresh the list
- `400` — inline validation
- `401` — clear session and redirect (global, `FSYS02`)
- `404` — error state
- `5xx` — retryable error state

## Local model

```ts
type MovementType = 'INCOME' | 'OUTCOME' | 'TRANSFER';
type Movement = {
  movementId: string;
  categoryId: string;
  subcategoryId: string;
  amount: number;
  type: MovementType;
  description: string;
  date: string;
  tagIds: string[];
};
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

Amount must be > 0; date is `YYYY-MM-DD`; description max 500; category and
subcategory are required and cascading.

## Out of Scope

- Pagination and ordering from the server; the list groups client-side.
- Enriching the response with names; the client resolves them.
- Multi-currency; COP only.
- Visual polish and manual cross-device checks; deferred to `docs/ui.md`.
