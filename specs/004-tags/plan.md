# Plan: Tags

## Routes (`src/app/...`)

- [x] `(tabs)/tags.tsx` — list
- [x] `tags/new.tsx`, `tags/[id]/edit.tsx` — form modals
- [x] `tags/_layout.tsx` — Stack + formSheet presentation

## Screens (`src/screens/...`)

- [x] `TagListScreen` (in `(tabs)/tags.tsx`)
- [x] `TagForm` component (new/edit routes)

## Components (`src/components/...`)

- [x] `TagForm`; reuse `ListRow` for rows
- [x] Reuse `Screen` (grouped, scroll), `FormSection`, `Button`, `TextInput`,
      `FormBanner`, `EmptyState`, `ErrorState`, `Spinner`, `confirmDestructive`

## UI / design (skills-based, Native restraint)

- [x] Grouped inset section; 20 px screen padding; tokens only
- [x] Form sheets for create/edit; destructive confirm for delete

## Data fetching (`src/lib/...`)

- [x] Queries: `useTags`, `useTag`
- [x] Mutations: `useCreateTag`, `useEditTag`, `useDeleteTag`
- [x] `src/lib/api/tags.ts` typed client

## Types & constants (`src/types/...`)

- [x] `Tag` + request types
- [x] Shared `field-validation.ts` (`validateName`, `validateDescription`)

## Tests (colocated `*.test.ts(x)`)

- [x] Tag API client
- [x] Query + mutation hooks incl. invalidation/removal
- [x] Field validation

## Verification

- [x] `npx tsc --noEmit`
- [x] `npx expo lint`
- [x] `npm test`
- [x] API smoke against the running backend (201/409/200/204/401)
- [ ] Visual check on mobile + web (screenshots)
