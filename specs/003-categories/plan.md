# Plan: Categories & Subcategories

## Routes (`src/app/...`)

- [x] `(tabs)/categories.tsx` — list
- [x] `categories/[id]/index.tsx` — subcategory list/detail
- [x] `categories/new.tsx`, `categories/[id]/edit.tsx` — category form modals
- [x] `categories/[id]/subcategories/new.tsx`, `categories/[id]/subcategories/[subcategoryId]/edit.tsx`
- [x] `categories/_layout.tsx` — Stack + formSheet presentation

## Screens (`src/screens/...`)

- [x] `CategoryListScreen` (in `(tabs)/categories.tsx`)
- [x] `CategoryDetailScreen` (subcategories)
- [x] `CategoryForm` component (new/edit routes)
- [x] `SubcategoryForm` component (new/edit routes)

## Components (`src/components/...`)

- [x] `TypeBadge`, `SegmentedControl`; `ListRow` gained a `trailing` slot
- [x] `confirmDestructive` (native alert / web confirm)
- [x] Reuse `Screen` (grouped, scroll), `FormSection`, `ListRow`, `Button`,
      `TextInput`, `FormBanner`, `EmptyState`, `ErrorState`, `Spinner`

## UI / design (skills-based, Native restraint)

- [x] Grouped inset sections; 20 px screen padding; tokens only
- [x] `TypeBadge` (income/outcome tokens); segmented Type control
- [x] Form sheets for create/edit; destructive confirm for deletes

## Data fetching (`src/lib/...`)

- [x] Queries: `useCategories`, `useCategory`, `useSubcategories`
- [x] Mutations: `useCreateCategory`, `useEditCategory`, `useDeleteCategory`,
  `useCreateSubcategory`, `useEditSubcategory`, `useDeleteSubcategory`
- [x] `src/lib/api/categories.ts` typed client

## Types & constants (`src/types/...`)

- [x] `Category`, `Subcategory` + request types
- [x] `category-validation.ts`

## Tests (colocated `*.test.ts(x)`)

- [x] Category/subcategory API client
- [x] Query + mutation hooks incl. invalidation/removal
- [x] Form validation

## Verification

- [x] `npx tsc --noEmit`
- [x] `npx expo lint`
- [x] `npm test`
- [x] API smoke against the running backend (201/409/200/204/401)
- [ ] Visual check on mobile + web (screenshots)
