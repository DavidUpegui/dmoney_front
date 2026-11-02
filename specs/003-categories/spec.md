# Categories

A category groups movements by type (`INCOME`/`OUTCOME`) and owns a set of
subcategories. Everything is scoped to the authenticated user.

## UI / UX Directives (temporary)

> These directives will move to `docs/ui.md` in a later pass. Until then they
> stay here and are not duplicated in other specs.

- **Tokens only** — every color, space, radius, type size and motion value comes
  from `@/theme`; no hardcoded values in screens or components.
- **Spacing rhythm** — 4-pt grid; screens pad 20 horizontally; group related
  fields into inset sections.
- **Typography** — one system type scale; hierarchy from weight and color.
- **Native controls first** — `Pressable` over Touchables; native sheets.
- **Four states** — collection screens implement loading / error / empty /
  content.
- **Motion** — user-triggered feedback only; respect reduced motion.
- **Accessibility** — labelled fields and controls, roles, visible focus.
- **Copy** — sentence case, active voice; errors state what happened.

## Requirements

- **FCAT01** — The categories tab lists the user's categories with name, type
  badge and description, grouped by income/outcome.
- **FCAT02** — When there are no categories, the list shows an empty state with
  a create action.
- **FCAT03** — A category can be created with name, optional description and
  type; invalid input is inline and a duplicate name (`409`) is shown inline.
- **FCAT04** — A category can be edited; the form is prefilled, only the fields
  present change, and a `409` is shown inline.
- **FCAT05** — Deleting a category asks for confirmation; a `409` because it
  still has movements is shown inline and the category remains.
- **FCAT06** — The detail screen shows the category and its subcategories, with
  an empty state and an action to add one.
- **FCAT07** — A subcategory can be added with name and optional description;
  invalid input is inline and a duplicate name (`409`) is shown inline.
- **FCAT08** — A subcategory can be edited; the form is prefilled and a `409`
  is shown inline.
- **FCAT09** — Deleting a subcategory asks for confirmation; a `409` because it
  still has movements is shown inline and the subcategory remains.
- **FCAT10** — Every mutation invalidates the queries it affects: the category
  list, the category detail and the subcategory list.

`FSYS01` covers the four states and `FSYS03` the server message; they are not
duplicated here.

## Routes & Screens

| Screen | Route | States |
|--------|-------|--------|
| `CategoryList` | `/categories` | loading, error, empty, content |
| `CategoryForm` (create) | `/categories/new` | form, pending, server error |
| `CategoryDetail` | `/categories/[id]` | loading, error, content; subcategories loading, error, empty, content |
| `CategoryForm` (edit) | `/categories/[id]/edit` | loading, error, form, pending, server error |
| `SubcategoryForm` (create) | `/categories/[id]/subcategories/new` | form, pending, server error |
| `SubcategoryForm` (edit) | `/categories/[id]/subcategories/[subcategoryId]/edit` | loading, error, form, pending, server error |

- The list is the `(tabs)` route `/categories`.
- Create/edit screens are modal sheets; deletes live behind a confirmation.
- The category detail owns the edit/delete actions and the subcategory list.

## API Consumption

| Method | Path | Req | Hook | Cache key |
|--------|------|-----|------|-----------|
| `GET` | `/api/categories` | FCAT01 | `useCategories` | `['categories']` |
| `POST` | `/api/categories` | FCAT03 | `useCreateCategory` | invalidates `['categories']` |
| `GET` | `/api/categories/{id}` | FCAT06 | `useCategory` | `['categories', id]` |
| `PATCH` | `/api/categories/{id}` | FCAT04 | `useEditCategory` | invalidates `['categories']`, `['categories', id]` |
| `DELETE` | `/api/categories/{id}` | FCAT05 | `useDeleteCategory` | removes detail, invalidates list |
| `GET` | `/api/categories/{id}/subcategories` | FCAT06 | `useSubcategories` | `['categories', id, 'subcategories']` |
| `POST` | `/api/categories/{id}/subcategories` | FCAT07 | `useCreateSubcategory` | invalidates subcategories |
| `PATCH` | `/api/categories/{id}/subcategories/{subcategoryId}` | FCAT08 | `useEditSubcategory` | invalidates subcategories |
| `DELETE` | `/api/categories/{id}/subcategories/{subcategoryId}` | FCAT09 | `useDeleteSubcategory` | invalidates subcategories |

### Status → UI

- `200/201` — content / success
- `204` — deleted, back to the list or detail
- `400` — inline validation
- `401` — clear session and redirect (global, `FSYS02`)
- `404` — error state
- `409` — inline message (duplicate name or resource in use)
- `5xx` — retryable error state

## Local model

```ts
type CategoryType = 'INCOME' | 'OUTCOME';
type Category = { id: string; name: string; description: string; type: CategoryType };
type Subcategory = {
  categoryId: string;
  subcategoryId: string;
  subcategoryName: string;
  subcategoryDescription: string;
};
```

Name and description are trimmed; name is required and max 100 client-side,
description max 255.

## Out of Scope

- Ordering of the category and subcategory lists.
- Reassigning movements when a category or subcategory is deleted; the back-end
  blocks it with `409` (see `OBSERVATIONS.md` in the back).
- More than two levels of hierarchy.
- Visual polish and manual cross-device checks; deferred to `docs/ui.md`.
