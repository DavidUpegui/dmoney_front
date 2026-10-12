# Feature: Categories & Subcategories

- **Status:** `draft`
- **Folder:** `003-categories`
- **Related area:** `tracker`

## 1. Overview

Full management of income/outcome categories and their subcategories: list
categories, view a category's subcategories, and create/edit/delete both.
Categories are the primary classifier for movements (see 005-movements), so
this feature is a dependency of movement creation.

Actors: the authenticated user, managing their own category taxonomy.

## 2. Requirements

### Functional (FR)

- **FR-1** — List all categories (`GET /api/categories`) with name, type badge
  (`INCOME`/`OUTCOME`), and description.
- **FR-2** — Create a category (`POST /api/categories`) with required `name`
  and `type`, optional `description`.
- **FR-3** — Edit a category (`PATCH /api/categories/{id}`); all fields
  optional, only provided fields update.
- **FR-4** — Delete a category (`DELETE /api/categories/{id}`) after
  confirmation.
- **FR-5** — View a category's subcategories (`GET
  /api/categories/{categoryId}/subcategories`).
- **FR-6** — Add a subcategory (`POST /api/categories/{categoryId}/subcategories`)
  with required `name`, optional `description`.
- **FR-7** — Edit a subcategory (`PATCH
  /api/categories/{categoryId}/subcategories/{subcategoryId}`).
- **FR-8** — Delete a subcategory (`DELETE
  /api/categories/{categoryId}/subcategories/{subcategoryId}`) after
  confirmation.
- **FR-9** — Mutations invalidate and refresh the relevant list queries so the
  UI stays consistent.

### Non-functional (NFR)

- **NFR-1** — All data screens implement the four states (loading/error/empty/content).
- **NFR-2** — Confirm before destructive deletes.
- **NFR-3** — Accessibility: actions reachable, error/empty states readable.

## 3. Navigation & Routes

```
src/app/
  (tabs)/
    categories.tsx                    # /categories — list
  categories/
    [id].tsx                          # /categories/[id] — subcategory list
    new.tsx                           # /categories/new — create (modal)
    [id]/edit.tsx                     # /categories/[id]/edit — edit (modal)
    [id]/subcategories/new.tsx        # new subcategory (modal)
    [id]/subcategories/[subcategoryId]/edit.tsx  # edit subcategory (modal)
```

- Create/edit forms present as modal sheets (native `formSheet`).
- Categories live inside the `(tabs)` group; `categories/` sub-routes are
  pushed onto the tab's stack.

## 4. Screens & UI

| Screen | Route | States & affordances |
|--------|-------|----------------------|
| `CategoryList` | `/categories` | loading → spinner; empty → "Sin categorías" + Create; error → retry; content → list grouped by type |
| `CategoryDetail` | `/categories/[id]` | loading/error/empty/content for subcategories; add/edit/delete actions |
| `CategoryForm` | `/categories/new`, `[id]/edit` | inline validation; save disabled while pending |
| `SubcategoryForm` | subcategory create/edit | inline validation; save disabled while pending |

Reusable: `Card`, `Button`, `TextInput`, `EmptyState`, `ErrorState`, `Spinner`.

## 5. Data Fetching & API

| Method | Path | Query / Mutation | Cache key |
|--------|------|------------------|-----------|
| `GET` | `/api/categories` | `useCategories` | `['categories']` |
| `GET` | `/api/categories/{id}` | `useCategory` | `['categories', id]` |
| `POST` | `/api/categories` | `useCreateCategory` | invalidates `['categories']` |
| `PATCH` | `/api/categories/{id}` | `useEditCategory` | invalidates `['categories']`, `['categories', id]` |
| `DELETE` | `/api/categories/{id}` | `useDeleteCategory` | invalidates `['categories']` |
| `GET` | `/api/categories/{id}/subcategories` | `useSubcategories` | `['categories', id, 'subcategories']` |
| `POST` | `/api/categories/{id}/subcategories` | `useCreateSubcategory` | invalidates subcategory list |
| `PATCH` | `/api/categories/{id}/subcategories/{sid}` | `useEditSubcategory` | invalidates subcategory list |
| `DELETE` | `/api/categories/{id}/subcategories/{sid}` | `useDeleteSubcategory` | invalidates subcategory list |

### Request / Response examples

```json
GET /api/categories
→ 200 [ { "id": "uuid", "name": "Groceries", "description": "Food", "type": "OUTCOME" } ]
```

```json
POST /api/categories
{ "name": "Groceries", "description": "Food", "type": "OUTCOME" }
→ 201 { "id": "uuid", "name": "Groceries", "description": "Food", "type": "OUTCOME" }
```

```json
POST /api/categories/{categoryId}/subcategories
{ "name": "Vegetables", "description": "Fresh produce" }
→ 201 { "categoryId": "uuid", "subcategoryId": "uuid", "subcategoryName": "Vegetables", "subcategoryDescription": "Fresh produce" }
```

### Status code → UI mapping

- `200/201` — content / success
- `204` — deleted → refresh list
- `400` — validation error → inline `message`
- `401` — redirect to login (global)
- `404` — not found → error state
- `409` — duplicate name → inline `message`
- `5xx` — retryable error

## 6. Data Model

```ts
type Category = {
  id: string;
  name: string;
  description: string;
  type: CategoryType; // 'INCOME' | 'OUTCOME'
};

type Subcategory = {
  categoryId: string;
  subcategoryId: string;
  subcategoryName: string;
  subcategoryDescription: string;
};

type CreateCategoryRequest = { name: string; description?: string; type: CategoryType };
type EditCategoryRequest = { name?: string; description?: string; type?: CategoryType };
type CreateSubcategoryRequest = { name: string; description?: string };
type EditSubcategoryRequest = { name?: string; description?: string };
```

## 7. Business Rules & Validation

- **BR-1** — Category `name` and `type` are required on create (non-blank).
- **BR-2** — Subcategory `name` is required (non-blank).
- **BR-3** — Edit fields that are blank are rejected client-side (backend
  rejects blank names via pattern).
- **BR-4** — A `409` (duplicate name) is shown inline, not as a generic error.
- **BR-5** — Deleting a category is destructive and requires confirmation.

## 8. Edge Cases

- Empty category list → empty state with Create action.
- Category with no subcategories → "Sin subcategorías" empty state.
- Delete a category that has movements (backend may still allow; if it 404s
  after, treat as gone and refresh).
- Duplicate name → `409` inline.
- Deleting while another list is showing → invalidate on success.

## 9. Acceptance Criteria

- **AC-1** — Given categories exist, when opening `/categories`, then they are
  listed with name, description, and type badge.
- **AC-2** — Given no categories, when opening `/categories`, then an empty
  state with a Create action is shown.
- **AC-3** — Given a valid create form, when submitted, then `201` is returned
  and the list refreshes to include the new category.
- **AC-4** — Given a duplicate category name, when submitting, then `409` is
  shown inline and nothing is created.
- **AC-5** — Given an edit form, when a field is changed and saved, then `PATCH`
  updates only that field and the list reflects it.
- **AC-6** — Given a category with subcategories, when opening its detail, then
  subcategories are listed with add/edit/delete actions.
- **AC-7** — Given a delete confirmation, when confirmed, then `204` is
  returned and the item disappears from the list.
- **AC-8** — Given a protected endpoint returns `401`, then the user is
  redirected to Login.

## 10. Out of Scope

- Reordering categories/subcategories (no endpoint).
- Bulk operations / import-export.
- Guarding delete against existing movements (backend-dependent; no
  confirmation contract from the API).
