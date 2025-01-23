// address -> json schema

import { mockSplitterSchema } from "./mock-splitter-schema";

export type LibrarySchema = object;
// in future, should be codeID -> address -> json schema
export const mockLibrarySchemaRegistry = {
  neutron15rldvafc5ufsf34fmjegyul32dm8uvjhg3xgk48j0qrrxqd8e0ssagamfj:
    mockSplitterSchema as LibrarySchema,
};
