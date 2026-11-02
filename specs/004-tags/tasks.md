# Tasks: Tags

## FTAG01 — List tags
- [x] `useTags` hook + `GET /api/tags` (`lib`)
- [x] List rows with name and description (`app`)
- [x] Tests for the hook, the API client and the screen (`lib`, `app`)
- [x] **Validado** — `ftag01_*` (3 tests)

## FTAG02 — Empty state with create action
- [x] `EmptyState` with “No tags yet” and the create action (`app`)
- [x] **Validado** — `ftag02_*` (1 tests)

## FTAG03 — Add opens the create sheet
- [x] `HeaderAction` pushes `/tags/new` (`app`)
- [x] **Validado** — `ftag03_*` (1 tests)

## FTAG04 — Form validation and pending state
- [x] `TagForm` validates the name and trims the values (`components`)
- [x] `Button` is disabled while submitting (`components`)
- [x] **Validado** — `ftag04_*` (3 tests)

## FTAG05 — Create refreshes the list
- [x] `useCreateTag` invalidates `['tags']` (`lib`)
- [x] Create screen returns on success (`app`)
- [x] **Validado** — `ftag05_*` (3 tests)

## FTAG06 — Edit opens with the current values
- [x] `useTag` + `GET /api/tags/{id}` (`lib`)
- [x] Edit sheet prefilled from the detail (`app`)
- [x] **Validado** — `ftag06_*` (4 tests)

## FTAG07 — Edit refreshes list and detail
- [x] `useEditTag` invalidates `['tags']` and `['tags', id]` (`lib`)
- [x] Edit screen returns on success (`app`)
- [x] **Validado** — `ftag07_*` (3 tests)

## FTAG08 — Delete with confirmation
- [x] `confirmDestructive` asks before deleting (`lib`)
- [x] `useDeleteTag` removes the detail and invalidates the list (`lib`)
- [x] Edit sheet deletes only after confirmation (`app`)
- [x] **Validado** — `ftag08_*` (6 tests)

## FTAG09 — 409 inline
- [x] Create and edit map a `409` to the form banner (`app`)
- [x] **Validado** — `ftag09_*` (2 tests)
