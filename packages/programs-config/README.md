# Programs Config

This package downloads the public programs configuration from the [Program Manager Config Repo](https://github.com/timewave-computer/valence-program-manager-config/tree/main).

## Scripts

### `generate.ts`

This script is run as part of the "prep" step, which generates necesaary files for the UI to consume.

The `generate.ts` script fetches chain configuration data from remote TOML files, constructs a JSON object the UI can use, and writes it to Typescript file.

The UI can import this file as a dependency. It uses it as a source of truth for which chains are supported, and what parameters are filled in for each domain.

### Usage

To run the `generate.ts` script, use the following command:

```sh
pnpm run prep
```
