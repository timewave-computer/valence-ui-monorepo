"use server";
import { mockLibrarySchemaRegistry } from "@/mock-data";
import {
  compile,
  type JSONSchema as JSONSchemaInput,
} from "json-schema-to-typescript";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import { LibraryJsonSchema, LibraryZodSchema } from "@/app/programs/server";

export async function fetchLibrarySchema(address: string) {
  // todo: for each library, fetch codeId, and use codeId to fetch schema
  const jsonSchema = mockLibrarySchemaRegistry[address];
  const validated = LibraryZodSchema.safeParse(jsonSchema);
  if (!validated.success) {
    console.error("Error validating schema", validated.error);
    return Promise.resolve(undefined);
  }
  const types = await jsonSchemaToTypescript(validated.data.execute);
  return Promise.resolve({
    raw: jsonSchema,
    typescript: types,
  });
}

export type FetchLibrarySchemaReturnValue = Awaited<
  ReturnType<typeof fetchLibrarySchema>
>;

export const jsonSchemaToTypescript = async (
  jsonSchema: LibraryJsonSchema["execute"],
): Promise<string | undefined> => {
  try {
    const dereferencedSchema = await $RefParser.dereference(jsonSchema);
    // need to define type explicitly, because there are clashes in the name 'JSONSchema'
    const result = await compile(
      dereferencedSchema as JSONSchemaInput,
      "schema",
      {
        bannerComment: "",
      },
    );
    return result;
  } catch (error) {
    console.error("Error dereferencing schema :", error);
    return undefined;
  }
};
