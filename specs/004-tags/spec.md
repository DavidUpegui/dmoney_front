# Tags

Tags label movements across the category tree so the user can group spending
by theme (vacation, work, family). A tag belongs to the authenticated user.

## UI / UX Directives (temporary)

> These directives will move to `docs/ui.md` in a later pass. Until then they
> stay here and are not duplicated in other specs.

- **Tokens only** — every color, space, radius, type size and motion value comes
  from `@/theme`; no hardcoded values in screens or components.
- **Spacing rhythm** — 4-pt grid; screens pad 20 horizontally; group related
  fields into inset sections; separate with `gap`, not ad-hoc margins.
- **Typography** — one system type scale; build hierarchy with weight and color
  before size; money uses tabular figures.
- **Native controls first** — reach for `@expo/ui` before RN built-ins or
  community libraries; `Pressable` over Touchables.
- **Semantic color** — light/dark via the theme; income and outcome use their
  tokens.
- **Four states** — data screens implement loading / error / empty / content;
  empty states invite an action.
- **Motion** — user-triggered feedback only; animate transform/opacity; respect
  reduced motion.
- **Accessibility** — labelled fields and controls, roles, visible focus,
  contrast, Dynamic Type.
- **Copy** — sentence case, active voice, the user's vocabulary; errors state
  what happened and how to fix it.

## Requirements

- **FTAG01** — The tags tab lists the user's tags with name and description.
- **FTAG02** — When there are no tags, the list shows an empty state with a
  create action.
- **FTAG03** — The “Add” action opens the create sheet.
- **FTAG04** — The form requires a non-blank name, trims the values before
  submitting, and disables the submit button while the request is pending.
- **FTAG05** — A successful create refreshes the list and returns to the
  previous screen.
- **FTAG06** — Tapping a tag opens the edit sheet with its current name and
  description.
- **FTAG07** — A successful edit refreshes the list and the tag detail, and
  returns to the previous screen.
- **FTAG08** — Deleting asks for confirmation; confirming removes the tag and
  refreshes the list, cancelling leaves it untouched.
- **FTAG09** — A `409` from the API is shown inline on the form.

The four states are `FSYS01`; the `401` redirect is `FSYS02`; the server message
on errors is `FSYS03`. They are not repeated here.

## Routes & Screens

| Screen | Route | States |
|--------|-------|--------|
| `TagList` | `/tags` | loading, error, empty, content |
| `TagForm` (create) | `/tags/new` | form, pending, server error |
| `TagForm` (edit) | `/tags/[id]/edit` | loading, error, form, pending, server error |

- The list is the `(tabs)` route `/tags`; the `tags/` stack is a sibling of the
  tabs and is guarded by the root auth gate.
- Create and edit present as modal sheets (`presentation: 'formSheet'`); delete
  lives on the edit sheet behind a confirmation.

## API Consumption

| Method | Path | Req | Hook | Cache key |
|--------|------|-----|------|-----------|
| `GET` | `/api/tags` | FTAG01 | `useTags` | `['tags']` |
| `GET` | `/api/tags/{id}` | FTAG06 | `useTag` | `['tags', id]` |
| `POST` | `/api/tags` | FTAG05 | `useCreateTag` | invalidates `['tags']` |
| `PATCH` | `/api/tags/{id}` | FTAG07 | `useEditTag` | invalidates `['tags']`, `['tags', id]` |
| `DELETE` | `/api/tags/{id}` | FTAG08 | `useDeleteTag` | removes `['tags', id]`, invalidates `['tags']` |

### Status → UI

- `200/201` — content / success
- `204` — deleted, back to the list
- `400` — inline validation message
- `401` — clear session and redirect to login (global, `FSYS02`)
- `404` — error state
- `409` — inline message on the form
- `5xx` — retryable error state

## Local model

```ts
type Tag = { id: string; name: string; description: string };
type CreateTagRequest = { name: string; description?: string };
type EditTagRequest = { name?: string; description?: string };
```

Name and description are trimmed; the name is required and at most 100 chars
client-side, the description at most 255.

## Out of Scope

- Tag colours, icons and ordering.
- Bulk operations and import/export.
- Visual polish, manual cross-device checks and motion work; deferred to the
  `docs/ui.md` pass.
- Pagination.
