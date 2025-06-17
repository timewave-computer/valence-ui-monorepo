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

1. To run the repo locally, install `turbo` and `pnpm` globally

2. Install dependencies

```bash
pnpm install
```

3. Add env file

```bash
# do for each app you want to run
cd app/valence-app
vercel env link
```

4. Run app

```bash
# to run only specific apps (recommended)
turbo dev
turbo dev --filter @valence-ui/valence-app
turbo dev --filter @valence-ui/valence-app --filter @valence-ui/ui-sandbox
turbo dev --filter @valence-ui/valence-static --filter @valence-ui/ui-sandbox
```

## Production build

To test production build

```bash
turbo build
turbo build --filter @valence-ui/valence-app
turbo start --filter @valence-ui/valence-app
```

## Manager config

Manager config downloads as a pre-build script. Run `turbo build` to rerun the prep scripts.

## How to add a package

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
