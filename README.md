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

## Running Valence UI

### 1. Prerequisites

1. [Install Nix](https://nixos.org/download).
2. Enable nix flakes:

```bash
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

### 2. Install project dependencies

```bash
nix develop  # Enter development shell with Node.js, pnpm, turbo
pnpm install # installs all dependencies
```

**Note**: if `pnpm install` fails on the `graz generate -g` postinstall step, trying rerunning `pnpm install`. This step can be flaky, but it will succeed with 2-3 tries.

### 3. Run in production mode

```bash
turbo build --filter @valence-ui/valence-app
turbo start --filter @valence-ui/valence-app
```

Access the app at the endpoint printed in the terminal.

### 4. (Optional) Run in dev mode

```bash
# run specific app
turbo dev --filter @valence-ui/valence-app ## starts main app
turbo dev --filter @valence-ui/valence-static ## starts static site

turbo dev # runs all apps (not recommended)
```

### 5. Deploying

Each app in `apps/` can be deployed on vercel. You should be able to select the folder without issue.

## Contributing

### Adding a package

- create a folder under packages with the following files, which import global project config (can copy from another package)
  - tsconfig.json
  - package.json
  - eslintrc.js
  - prettierrc.js
  - .gitignore
- name the package `@valence-ui/name`
- import the package from other repos
- add short description to README

### Adding an app

- create the app in the `apps` folder
- add same files as needed above (can use valence-static or ui-sandbox as template)
- name the app `@valence-ui/name`
- add app to the turbo.json file
- import packages in package.json
- add short description to README
