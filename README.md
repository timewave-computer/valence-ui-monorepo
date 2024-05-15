# valence-ui

A UI for the various Valence services, built in Next.JS

## State management decisions

- managing client/server specific state (reading, caching, mutations, optimistic updates):
  - react-query + nextjs server actions
- managing **application specific state** :
  - `nuqs` for persisted page state (url params)
  - `useState` is default whenever possible (keep it simple until you need something more complex)
  - `jotai` for globals, when useState no longer 'ergonomic'
  - `zustand` for 'state machines'. Use when necessary for more complex state manipulation or modifiyng data outside of react

## Linting

Linting happens automatically on commit.

To lint manually:

```bash
# lint staged files
git add .
pnpm lint-staged

# lint everything
pnpm exec prettier . --write
```
