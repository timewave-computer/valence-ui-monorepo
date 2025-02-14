# valence-app

A UI for the various Valence services, built in Next.JS

# Local dev against local-interchain

## Prereqs

- install [local interchain ](https://github.com/timewave-computer/valence-protocol/tree/main/local-interchaintest#installing-local-interchain)
- install [ngrok](https://ngrok.com/) (to connect to chain from the UI)

## Instructions

- start docker desktop

```bash
local-ic start neutron
local-ic start stargaze
```

- find available rpc and rest endpoints for each chain. make sure processes are _started_.
- create ngrok account, get auth token and create API key in their ui
- create ngrok config file

```yaml
version: 3
agent:
  api_key: <your api key>
  authtoken: <your auth token>
  web_allow_hosts:
   - localhost
tunnels:
  neutron-rest:
    addr: <chain rest endpoint port>
    proto: http
  neutron-rpc:
    addr: <chain rpc endpoint port>
    proto: http
~
```

- run ngrok for each chain, to expose port to browser

```bash
ngrok start --all --config ./ngrok.yml
```

- set RPC URLs in `.env.local` or via the UI

## State management decisions

- managing client/server specific state (reading, caching, mutations, optimistic updates):
  - react-query + nextjs server actions
- managing **application specific state** :
  - `nuqs` for persisted page state (url params)
  - `useState` is default whenever possible (keep it simple until you need something more complex)
  - `jotai` for globals, when useState no longer 'ergonomic'
  - `zustand` can be used for 'state machines'. Use when necessary for more complex state manipulation or modifiyng data outside of react. Currently its not needed / not used.

## Preview Env & Feature Flags

In addition to commit-level previews in vercel, we also have a long-standing 'auto/preview' branch that stays up to date with main via github workflows. This branch is deployed with preview environment variables, and lets us view features that are enabled on in preview.

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

## Connect to testnet

By default the UI connects to `neutron-1`. In development, you can set the `NEXT_PUBLIC_CHAIN_ID` environment variable to `pion-1` to connect to neutron testnet. This is the only other chain connection that is supported currently.
