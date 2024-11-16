## simplest hardcoded setup for now, since its only 1 file

BASE_PATH='./server'

JSON_TO_TS_INPUT_PATH="${BASE_PATH}/schema/sanitized-program-config-manager.json"
JSON_TO_TS_OUTPUT_PATH="${BASE_PATH}/types/ProgramConfigManager.types.ts"
TS_TO_ZOD_OUTPUT_PATH="${BASE_PATH}/zod/ProgramConfigManager.ts"

EXPORT_SCRIPT_FILE_PATH="${BASE_PATH}/export.ts"

pnpm json2ts --input "$JSON_TO_TS_INPUT_PATH" --output "$JSON_TO_TS_OUTPUT_PATH"
pnpm ts-to-zod "$JSON_TO_TS_OUTPUT_PATH" "$TS_TO_ZOD_OUTPUT_PATH"
pnpm tsx "$EXPORT_SCRIPT_FILE_PATH" 


