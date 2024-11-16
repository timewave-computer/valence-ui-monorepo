## simplest hardcoded setup for now, since its only 1 file

JSON_TO_TS_INPUT_PATH="./server/schema/sanitized-program-config-manager.json"
JSON_TO_TS_OUTPUT_PATH="./dist/server/types/ProgramConfigManager.types.ts"
TS_TO_ZOD_OUTPUT_PATH="./dist/server/zod/ProgramConfigManager.ts"

pnpm json2ts --input "$JSON_TO_TS_INPUT_PATH" --output "$JSON_TO_TS_OUTPUT_PATH"
pnpm ts-to-zod "$JSON_TO_TS_OUTPUT_PATH" "$TS_TO_ZOD_OUTPUT_PATH"

## NOTE: the index file needs to be update manaully for export from dist
