# Tasks: Authentication

Checklist of work items. Mark `[x]` when done.

## Spec
- [x] `spec.md` written and reviewed

## Implementation
- [x] Auth provider + session state + token store wiring
- [x] Login screen + `useLogin`
- [x] Register screen + `useRegister`
- [x] Auth gate routing (splash → login/tabs)
- [x] Global 401 handler
- [x] Settings logout

## Tests
- [x] Form validation tests
- [x] Mutation tests
- [x] Auth gate / session-state tests
- [x] 401 handling tests

## UI revision (Native restraint)
- [x] `src/theme.ts` extended (spacing, control heights, grouped surface, motion)
- [x] New components added: `BrandMark`, `FormSection`, `ListRow`
- [x] `Screen`/`TextInput`/`Button` restyled (tokens only, 20 px padding)
- [x] Login rebuilt (brand + inset form + full-width primary action)
- [x] Register rebuilt (matches Login)
- [x] Settings rebuilt (inset grouped rows + destructive logout)
- [x] Motion added (press feedback, banner reveal); reduced motion honored

## Verification
- [x] `npx tsc --noEmit` passes
- [x] `npx expo lint` passes
- [x] `npm test` (jest-expo) passes
- [ ] Visual check in light/dark + reduced motion (mobile + web)
