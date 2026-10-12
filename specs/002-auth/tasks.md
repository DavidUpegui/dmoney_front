# Tasks: Authentication

Checklist of work items. Mark `[x]` when done.

## Spec
- [ ] `spec.md` written and reviewed

## Implementation
- [ ] Auth provider + session state + token store wiring
- [ ] Login screen + `useLogin`
- [ ] Register screen + `useRegister`
- [ ] Auth gate routing (splash → login/tabs)
- [ ] Global 401 handler
- [ ] Settings logout

## Tests
- [ ] Form validation tests
- [ ] Mutation tests
- [ ] Auth gate routing tests
- [ ] 401 handling tests

## Verification
- [ ] `npx tsc --noEmit` passes
- [ ] `npx expo lint` passes
- [ ] `npm test` (jest-expo) passes
