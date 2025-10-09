# Monorepo for Valence UI

This repository contains all applications, shared packages, and configuration files for the **Valence UI** ecosystem.

## Folder structure

### Apps

- **valence-app** – Main application interface for Valence UI
- **valence-static** – Landing page and blog
- **ui-sandbox** – Component library and development playground

### Packages

- **config** – Shared configuration for all apps (TypeScript, ESLint, Tailwind, etc.)
- **fonts** – Centralized source for custom fonts
- **generated-types** – JSON contract schemas, scripts, and generated TypeScript types
- **socials** – Centralized source of URLs, domains, and project links
- **ui-components** – Shared and reusable UI components

## Getting Started

### 1. Prerequisites

1. [Install Nix](https://nixos.org/download).
2. Enable nix flakes:

```bash
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

### 2. Install project dependencies

```bash
nix develop  # Enter development shell with Node.js, pnpm, and turbo
pnpm install # Install all dependencies
```

**Note**: if `pnpm install` fails during the `graz generate -g` postinstall step, trying rerunning the command. This step can occasionally be flaky, but it will succeed after 2–3 attempts.

### 3. Run in production mode

```bash
turbo build --filter @valence-ui/valence-app
turbo start --filter @valence-ui/valence-app
```

The app will be available at the URL printed in the terminal.

### 4. (Optional) Run in dev mode

```bash
# Run specific apps
turbo dev --filter @valence-ui/valence-app     # Main app
turbo dev --filter @valence-ui/valence-static  # Static site

# Run all apps (not recommended)
turbo dev
```

### 5. Deployment

Each app in the `apps/` directory can be deployed individually to Vercel with a few clicks.
When creating a new Vercel project, simply select the corresponding app folder.

## Contributing

### Adding a package

- Create a folder under `packages/` with the following files, which import global project config (can copy from another package)
  - tsconfig.json
  - package.json
  - eslintrc.js
  - prettierrc.js
  - .gitignore
- Name the package `@valence-ui/name`
- Import the package from other repos
- Add short description to README

### Adding an app

- Create a new folder under `apps`
- Include the same configuration files as above (you can use `valence-static` or `ui-sandbox` as a template)
- Name the app `@valence-ui/name`
- Add app to the turbo.json file
- Import packages in package.json
- Add short description to README
