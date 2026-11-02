# Tasks: Categories

## FCAT01 — List categories
- [x] `useCategories` + `GET /api/categories` (`lib`)
- [x] Grouped rows with type badge (`app`)
- [x] **Validado** — `fcat01_*` (3 tests)

## FCAT02 — Empty state with create action
- [x] Empty state and header action (`app`)
- [x] **Validado** — `fcat02_*` (1 tests)

## FCAT03 — Create a category
- [x] `useCreateCategory` + create form (`lib`, `app`)
- [x] Validation and `409` inline (`app`)
- [x] **Validado** — `fcat03_*` (5 tests)

## FCAT04 — Edit a category
- [x] `useEditCategory` invalidates list and detail (`lib`)
- [x] Prefilled edit form and `409` inline (`app`)
- [x] **Validado** — `fcat04_*` (7 tests)

## FCAT05 — Delete a category
- [x] Confirmation and `useDeleteCategory` (`lib`, `app`)
- [x] `409` inline when it still has movements (`app`)
- [x] **Validado** — `fcat05_*` (5 tests)

## FCAT06 — Category detail with subcategories
- [x] `useCategory` + `useSubcategories` (`lib`)
- [x] Detail screen with subcategory states and add action (`app`)
- [x] **Validado** — `fcat06_*` (7 tests)

## FCAT07 — Add a subcategory
- [x] `useCreateSubcategory` + form (`lib`, `app`)
- [x] Validation and `409` inline (`app`)
- [x] **Validado** — `fcat07_*` (6 tests)

## FCAT08 — Edit a subcategory
- [x] `useEditSubcategory` + prefilled form (`lib`, `app`)
- [x] `409` inline (`app`)
- [x] **Validado** — `fcat08_*` (5 tests)

## FCAT09 — Delete a subcategory
- [x] Confirmation and `useDeleteSubcategory` (`lib`, `app`)
- [x] `409` inline when it still has movements (`app`)
- [x] **Validado** — `fcat09_*` (5 tests)

## FCAT10 — Query invalidation
- [x] Create/edit/delete invalidate list, detail and subcategories (`lib`)
- [x] **Validado** — `fcat10_*` (1 tests)
