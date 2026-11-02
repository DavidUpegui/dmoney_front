# Tasks: Movements

## FMOV01 — List movements
- [x] `useMovements` + `GET /api/movements` (`lib`)
- [x] Grouped list with amount, category/subcategory and tags (`app`)
- [x] **Validado** — `fmov01_*` (3 tests)

## FMOV02 — Empty state
- [x] “No movements yet” with create action; “No matching movements” with filters (`app`)
- [x] **Validado** — `fmov02_*` (2 tests)

## FMOV03 — Filters
- [x] Categories, subcategories, tags, type, date range and search (`app`)
- [x] Subcategory options loaded for all categories (`lib`, `app`)
- [x] **Validado** — `fmov03_*` (5 tests)

## FMOV04 — Filter sheet
- [x] Apply and clear filters from the sheet (`app`)
- [x] Search updates the list filters (`app`)
- [x] **Validado** — `fmov04_*` (2 tests)

## FMOV05 — Create a movement
- [x] `useCreateMovement` + form (`lib`, `app`)
- [x] Validation, pending state and server error (`app`)
- [x] **Validado** — `fmov05_*` (5 tests)

## FMOV06 — Edit a movement
- [x] `useMovement` + `useEditMovement` + prefilled form (`lib`, `app`)
- [x] **Validado** — `fmov06_*` (5 tests)

## FMOV07 — Delete a movement
- [x] Confirmation and `useDeleteMovement` (`lib`, `app`)
- [x] **Validado** — `fmov07_*` (4 tests)

## FMOV08 — Query invalidation
- [x] Create/edit/delete invalidate the list and detail (`lib`)
- [x] **Validado** — `fmov08_*` (1 tests)

## FMOV09 — Server errors inline
- [x] Create and edit show the server message (`app`)
- [x] **Validado** — `fmov09_*` (2 tests)

## FMOV10 — Navigation
- [x] Header opens create; row opens edit (`app`)
- [x] **Validado** — `fmov10_*` (2 tests)

## FMOV11 — Amount formatting
- [x] `AmountText` uses `formatAmount` and the type sign (`components`)
- [x] **Validado** — `fmov11_*` (1 tests)
