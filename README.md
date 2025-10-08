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

1. Set up development environment
   **Prerequisites:** [Install Nix](https://nixos.org/download) and enable flakes:

For a complete, reproducible development environment with all tools pre-configured:

```bash
nix develop          # Enter development shell with Node.js 20, pnpm 9.0, turbo
pnpm install
```

2. Start application in dev mode

```bash

# run specific app
turbo dev --filter @valence-ui/valence-app ## starts main app
turbo dev --filter @valence-ui/valence-static ## starts static site

turbo dev # runs all apps (not recommended)

```

### Production Build

```bash
turbo build ## Builds all
turbo build --filter @valence-ui/valence-app
turbo start --filter @valence-ui/valence-app
```

## Contributing

### How to add a package

- create a folder under packages with the following files, which import global project config (can copy from another package)
  - tsconfig.json
  - package.json
  - eslintrc.js
  - prettierrc.js
  - .gitignore
- name the package `@valence-ui/name`
- import the package from other repos
- add short description to README

### How to add an app

- create the app in the `apps` folder
- add same files as needed above (can use valence-static or ui-sandbox as template)
- name the app `@valence-ui/name`
- add app to the turbo.json file
- import packages in package.json
- add short description to README
