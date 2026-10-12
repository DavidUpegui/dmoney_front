# Plan: Categories & Subcategories

## Routes (`src/app/...`)

- [ ] `(tabs)/categories.tsx` — list
- [ ] `categories/[id].tsx` — subcategory list/detail
- [ ] `categories/new.tsx`, `categories/[id]/edit.tsx` — category form modals
- [ ] `categories/[id]/subcategories/new.tsx`, `categories/[id]/subcategories/[subcategoryId]/edit.tsx`

## Screens (`src/screens/...`)

- [ ] `CategoryListScreen`
- [ ] `CategoryDetailScreen` (subcategories)
- [ ] `CategoryFormScreen`
- [ ] `SubcategoryFormScreen`

## Components (`src/components/...`)

- [ ] `CategoryRow`, `TypeBadge`, `SubcategoryRow`
- [ ] `ConfirmDialog` (delete confirmation)
- [ ] Reuse `Card`, `Button`, `TextInput`, `EmptyState`, `ErrorState`

## Data fetching (`src/hooks/...`, `src/lib/api/...`)

- [ ] Queries: `useCategories`, `useCategory`, `useSubcategories`
- [ ] Mutations: `useCreateCategory`, `useEditCategory`, `useDeleteCategory`,
  `useCreateSubcategory`, `useEditSubcategory`, `useDeleteSubcategory`

## Types & constants (`src/types/...`)

- [ ] `Category`, `Subcategory` + request types

## Tests (colocated `*.test.ts(x)`)

- [ ] `CategoryList` four states
- [ ] Category form validation
- [ ] `useCreateCategory` / `useEditCategory` mutation + invalidation
- [ ] `useDeleteCategory` (confirm → invalidate)
- [ ] Subcategory CRUD hooks

## Verification

- [ ] `npx tsc --noEmit`
- [ ] `npx expo lint`
- [ ] `npm test`
