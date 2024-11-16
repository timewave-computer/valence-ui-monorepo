import { FromSchema } from "json-schema-to-ts";

import fs from "fs";
import path from "path";

// Path to your JSON schema file
const schemaFilePath = path.resolve(
  __dirname,
  "server-schema/program-config-manager.json"
);

// Output path for the generated TypeScript types
const outputFilePath = path.resolve(
  __dirname,
  "types-modified/ProgramConfigManager.types.ts"
);

// Generate TypeScript types from the JSON schema
compileFromFile(schemaFilePath)
  .then((ts) => {
    fs.writeFileSync(outputFilePath, ts);
    console.log(`Types generated and saved to ${outputFilePath}`);
  })
  .catch((error) => {
    console.error("Error generating types:", error);
  });
