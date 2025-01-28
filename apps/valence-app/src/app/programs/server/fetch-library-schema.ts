"use server";
import { mockLibrarySchemaRegistry } from "@/mock-data";

export async function fetchLibrarySchema(
  address: string,
): Promise<Record<string, object>> {
  // todo: for each library, fetch codeId, and use codeId to fetch schema
  return Promise.resolve(mockLibrarySchemaRegistry[address]);
}
