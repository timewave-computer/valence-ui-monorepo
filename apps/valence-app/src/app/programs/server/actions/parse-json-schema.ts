"use server";
import { compile } from "json-schema-to-typescript";
import $RefParser from "@apidevtools/json-schema-ref-parser";

import { fetchLibrarySchema } from "@/app/programs/server";

export const parseJsonSchema = async (libraryAddress: string): Promise<any> => {
  const schema = await fetchLibrarySchema(libraryAddress);

  if (!schema) {
    return null;
  }

  let dereferencedSchema = {};
  try {
    dereferencedSchema = await $RefParser.dereference(schema.execute);
    console.log("parsing schema", dereferencedSchema);

    const result = await compile(dereferencedSchema, "MySchema", {
      bannerComment: "",
    });
    console.log("MySchema TS", result);
    dereferencedSchema.ts = result;
  } catch (error) {
    console.error("Error dereferencing schema:", error);
  }

  console.log("returning");
  return dereferencedSchema;
};
