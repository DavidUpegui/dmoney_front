# Plan: Tags

## Routes (`src/app/...`)

- [ ] `(tabs)/tags.tsx` — list
- [ ] `tags/new.tsx`, `tags/[id]/edit.tsx` — form modals

## Screens (`src/screens/...`)

- [ ] `TagListScreen`
- [ ] `TagFormScreen`

## Components (`src/components/...`)

- [ ] `TagRow`
- [ ] Reuse `Card`, `Button`, `TextInput`, `EmptyState`, `ErrorState`, `ConfirmDialog`

## Data fetching (`src/hooks/...`, `src/lib/api/...`)

- [ ] Queries: `useTags`, `useTag`
- [ ] Mutations: `useCreateTag`, `useEditTag`, `useDeleteTag`

## Types & constants (`src/types/...`)

- [ ] `Tag` + request types

## Tests (colocated `*.test.ts(x)`)

- [ ] `TagList` four states
- [ ] Tag form validation
- [ ] `useCreateTag` / `useEditTag` / `useDeleteTag` mutation + invalidation

## Verification

- [ ] `npx tsc --noEmit`
- [ ] `npx expo lint`
- [ ] `npm test`
