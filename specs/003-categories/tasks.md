# Tasks: Categories & Subcategories

Checklist of work items. Mark `[x]` when done.

## Spec
- [x] `spec.md` written and reviewed

## Implementation
- [x] Category list screen + `useCategories`
- [x] Category detail screen + `useSubcategories`
- [x] Category create/edit forms + mutations
- [x] Subcategory create/edit forms + mutations
- [x] Delete flows (category + subcategory) with confirmation
- [x] UI/UX Directives applied (grouped sections, tokens, form sheets, motion)

## Tests
- [x] List four-state coverage via hooks + API client tests
- [x] Form validation tests
- [x] Mutation + invalidation tests
- [x] Delete confirmation via `confirmDestructive` (native/web)

## Verification
- [x] `npx tsc --noEmit` passes
- [x] `npx expo lint` passes
- [x] `npm test` (jest-expo) passes
- [ ] Visual check on mobile + web (screenshots)
