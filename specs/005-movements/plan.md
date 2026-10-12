# Plan: Movements

## Routes (`src/app/...`)

- [ ] `(tabs)/index.tsx` — movements list + filters + FAB
- [ ] `movements/new.tsx` — create form (modal)
- [ ] `movements/[id]/edit.tsx` — edit form (modal)
- [ ] `movements/[id].tsx` — detail (optional slice)

## Screens (`src/screens/...`)

- [ ] `MovementListScreen` (list + filter bar)
- [ ] `MovementFormScreen` (cascading category→subcategory, tag multi-select)
- [ ] `MovementDetailScreen` (optional)

## Components (`src/components/...`)

- [ ] `MovementRow`, `FilterBar`, `TypeBadge`, `AmountText`
- [ ] `CategoryPicker`, `SubcategoryPicker`, `TagPicker`, `DatePicker`
- [ ] Reuse `Card`, `Button`, `TextInput`, `EmptyState`, `ErrorState`, `ConfirmDialog`

## Data fetching (`src/hooks/...`, `src/lib/api/...`)

- [ ] Queries: `useMovements` (keyed by filters), `useMovement`
- [ ] Mutations: `useCreateMovement`, `useEditMovement`, `useDeleteMovement`
- [ ] Filter query-string serialization (repeatable params)

## Types & constants (`src/types/...`)

- [ ] `Movement`, `CreateMovementRequest`, `EditMovementRequest`, `MovementFilters`

## Tests (colocated `*.test.ts(x)`)

- [ ] `MovementList` four states
- [ ] Filter serialization (arrays, date range)
- [ ] Form validation (amount > 0, description ≤ 500, date format)
- [ ] `useCreateMovement` / `useEditMovement` / `useDeleteMovement` mutation + invalidation
- [ ] Amount sign formatting (income vs outcome)

## Verification

- [ ] `npx tsc --noEmit`
- [ ] `npx expo lint`
- [ ] `npm test`
