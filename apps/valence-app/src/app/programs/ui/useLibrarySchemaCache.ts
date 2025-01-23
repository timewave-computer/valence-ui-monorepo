import { QUERY_KEYS } from "@/const";

import { useQueries, useQueryClient } from "@tanstack/react-query";
import { type GetProgramDataReturnValue } from "@/app/programs/server";
import { LibrarySchema, mockLibrarySchemaRegistry } from "@/mock-data";
import { useCallback } from "react";

const librarySchemaQueryFn = (address: string) => {
  // TODO fetch codeId + library schema from registry
  return mockLibrarySchemaRegistry[address];
};

// hook can be instantated at root client level and used via useCache
export const useInitializeLibrarySchemaCache = (
  initialData: GetProgramDataReturnValue["librarySchemas"],
) => {
  return useQueries({
    queries: Object.keys(initialData).map((address) => {
      return {
        refetchInterval: 0,
        queryKey: [QUERY_KEYS.PROGRAMS_LIBRARY_SCHEMA, address],
        initialData: initialData[address],
        queryFn: async () => {
          return librarySchemaQueryFn(address);
        },
      };
    }),
  });
};

export const useLibrarySchema = () => {
  const queryClient = useQueryClient();

  // data is prefetched
  const getLibrarySchema = useCallback(
    (address: string) => {
      return queryClient.getQueryData<LibrarySchema>([
        QUERY_KEYS.PROGRAMS_LIBRARY_SCHEMA,
        address,
      ]);
    },
    [queryClient],
  );
  return {
    getLibrarySchema,
  };
};
