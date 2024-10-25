# Monorepo for Valence UI

## Local development

To run the repo locally, install turbo globally, then run:

```bash
pnpm install
turbo dev
```

To test production build

```bash
turbo build
```

## How to add a package

- create a folder under packages with the following files, which import global project config (can copy from another package)
  - tsconfig.json
  - package.json
  - eslintrc.js
  - prettierrc.js
  - .gitignore
- name the package `@valence-ui/name`
- import the package from other repos
