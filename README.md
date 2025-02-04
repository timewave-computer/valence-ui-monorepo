# Monorepo for Valence UI

## Folder structure

- apps

  - valence static: landing page and blog
  - valence app: ui for valence applications
  - ui sandbox: component library, tool for previewing and developing components

- packages
  - config: project config imported by all apps as required (typescript, eslint, tailwind, etc)
  - fonts: single importable source of our custom fonts
  - generated-types: holds JSON contract schema, related scripts, and generated types for the UI
  - socials: since source of URLS, domains, project links
  - ui-components: reusable UI components

## Local development

To run the repo locally, install `turbo` and `pnpm` globally, then run:

```bash
pnpm install
turbo dev

# to run only specific apps (recommended)
turbo dev --filter @valence-ui/valence-app --filter @valence-ui/ui-sandbox
```

To test production build

```bash
turbo build
```

## How to add an package

- create a folder under packages with the following files, which import global project config (can copy from another package)
  - tsconfig.json
  - package.json
  - eslintrc.js
  - prettierrc.js
  - .gitignore
- name the package `@valence-ui/name`
- import the package from other repos
- add short description to README

## How to add an app

- create the app in the `apps` folder
- add same files as needed above (can use valence-static or ui-sandbox as template)
- name the app `@valence-ui/name`
- add app to the turbo.json file
- import packages in package.json
- add short description to README
