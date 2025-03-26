# Programs Config

This package is responsible for generating the public programs configuration from the [Program Manager Config Repo](https://github.com/timewave-computer/valence-program-manager-config/tree/main).

## Scripts

### `generate.ts`

The `generate.ts` script fetches chain configuration data from remote TOML files, validates it, and writes it to a TypeScript file.

### Usage

To run the `generate.ts` script, use the following command:

```sh
pnpm run prep
```
