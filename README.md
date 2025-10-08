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

### Option 1: Standard Setup

Install `turbo` and `pnpm` globally, then run:

```bash
pnpm install
turbo dev

# to run only specific apps (recommended)
turbo dev --filter @valence-ui/valence-app
turbo dev --filter @valence-ui/valence-app --filter @valence-ui/ui-sandbox
turbo dev --filter @valence-ui/valence-static --filter @valence-ui/ui-sandbox
```

FYI: if you see this error, try again. Sometimes the generate command fails

```
│ Running graz generate -g
│ ⏳DOCTGenerating chain list...
│ ⚠️     blockxtestnet has no REST/RPC endpoints, skipping codegen...
│ ⚠️yntaxcudostestnet has no fee currencies, skipping codegen...
│ ⚠️   atlombardledgertestnet has no REST/RPC endpoints, skipping codegen...
│ ⚠️   atmetanovaversetestnet has no REST/RPC endpoints, skipping codegen...
│ ⚠️   atneuradevnet has no REST/RPC endpoints, skipping codegen...
│ ⚠️   atneuratestnet has no REST/RPC endpoints, skipping codegen...
│ ⚠️   atseitestnet has no REST/RPC endpoints, skipping codegen...
│ ⚠️   atulastestnet has no fee currencies, skipping codegen...
│ <anonymous_script>:1
│ <!DOCTYPE
```

### Option 2: Nix Development Environment

For a complete, reproducible development environment with all tools pre-configured:

```bash
nix develop          # Enter development shell with Node.js 20, pnpm 9.0, Rust, WebAssembly tools
pnpm install         # Same commands as above
turbo dev            # Everything works the same
```

**Prerequisites:** [Install Nix](https://nixos.org/download) and enable flakes:

```bash
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

**Benefits:** Reproducible environment, automatic tool installation, WebAssembly support configured.

### Production Build

```bash
turbo build
turbo build --filter @valence-ui/valence-app
turbo start --filter @valence-ui/valence-app
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
- add short description to README

## How to add an app

- create the app in the `apps` folder
- add same files as needed above (can use valence-static or ui-sandbox as template)
- name the app `@valence-ui/name`
- add app to the turbo.json file
- import packages in package.json
- add short description to README
