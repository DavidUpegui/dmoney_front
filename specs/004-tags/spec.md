# Feature: Tags

- **Status:** `draft`
- **Folder:** `004-tags`
- **Related area:** `tracker`

## 1. Overview

Full management of movement tags: list, create, edit, and delete. Tags are
free-form labels attached to movements (see 005-movements) and are owned by the
authenticated user.

Actors: the authenticated user.

## 2. Requirements

### Functional (FR)

- **FR-1** — List all tags (`GET /api/tags`) with name and description.
- **FR-2** — Create a tag (`POST /api/tags`) with required `name`, optional
  `description`.
- **FR-3** — Edit a tag (`PATCH /api/tags/{id}`); all fields optional.
- **FR-4** — Delete a tag (`DELETE /api/tags/{id}`) after confirmation.
- **FR-5** — Mutations invalidate the tag list query.

### Non-functional (NFR)

- **NFR-1** — Four states (loading/error/empty/content) on the list.
- **NFR-2** — Confirm before delete.
- **NFR-3** — Accessibility: readable errors and reachable actions.

## 3. Navigation & Routes

```
src/app/
  (tabs)/
    tags.tsx             # /tags — list
  tags/
    new.tsx              # /tags/new — create (modal)
    [id]/edit.tsx        # /tags/[id]/edit — edit (modal)
```

- Create/edit present as modal sheets on the tags tab's stack.

## 4. Screens & UI

| Screen | Route | States & affordances |
|--------|-------|----------------------|
| `TagList` | `/tags` | loading → spinner; empty → "Sin etiquetas" + Create; error → retry; content → list |
| `TagForm` | `/tags/new`, `/tags/[id]/edit` | inline validation; save disabled while pending |

Reusable: `Card`, `Button`, `TextInput`, `EmptyState`, `ErrorState`, `Spinner`.

## 5. Data Fetching & API

| Method | Path | Query / Mutation | Cache key |
|--------|------|------------------|-----------|
| `GET` | `/api/tags` | `useTags` | `['tags']` |
| `GET` | `/api/tags/{id}` | `useTag` | `['tags', id]` |
| `POST` | `/api/tags` | `useCreateTag` | invalidates `['tags']` |
| `PATCH` | `/api/tags/{id}` | `useEditTag` | invalidates `['tags']`, `['tags', id]` |
| `DELETE` | `/api/tags/{id}` | `useDeleteTag` | invalidates `['tags']` |

### Request / Response examples

```json
GET /api/tags
→ 200 [ { "id": "uuid", "name": "vacation", "description": "Trip to Italy" } ]
```

```json
POST /api/tags
{ "name": "vacation", "description": "Trip to Italy" }
→ 201 { "id": "uuid", "name": "vacation", "description": "Trip to Italy" }
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
type Tag = { id: string; name: string; description: string };
type CreateTagRequest = { name: string; description?: string };
type EditTagRequest = { name?: string; description?: string };
```

## 7. Business Rules & Validation

- **BR-1** — Tag `name` is required (non-blank).
- **BR-2** — Blank names are rejected client-side (backend enforces non-blank
  on edit via pattern).
- **BR-3** — A `409` (duplicate name) is shown inline.
- **BR-4** — Deleting a tag is destructive and requires confirmation.

## 8. Edge Cases

- Empty tag list → empty state with Create action.
- Duplicate name → `409` inline.
- Delete a tag still referenced by movements → backend may reject or allow;
  if it fails, surface the message.
- In-flight mutation → disable submit to prevent duplicates.

## 9. Acceptance Criteria

- **AC-1** — Given tags exist, when opening `/tags`, then they are listed with
  name and description.
- **AC-2** — Given no tags, when opening `/tags`, then an empty state with a
  Create action is shown.
- **AC-3** — Given a valid create form, when submitted, then `201` is returned
  and the list refreshes.
- **AC-4** — Given a duplicate tag name, when submitting, then `409` is shown
  inline.
- **AC-5** — Given an edit form, when a field changes and saves, then `PATCH`
  updates it and the list reflects it.
- **AC-6** — Given a delete confirmation, when confirmed, then `204` is
  returned and the tag disappears.

## 10. Out of Scope

- Tag coloring/icons (no backend fields for them).
- Bulk operations / import-export.
