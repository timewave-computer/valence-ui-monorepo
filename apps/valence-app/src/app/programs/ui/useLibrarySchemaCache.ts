import { QUERY_KEYS } from "@/const";

import { useQueries, useQueryClient } from "@tanstack/react-query";
import {
  fetchLibrarySchema,
  type GetProgramDataReturnValue,
} from "@/app/programs/server";
import { LibraryJsonSchema } from "@/mock-data";
import { useCallback } from "react";

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
          return fetchLibrarySchema(address);
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
      return queryClient.getQueryData<LibraryJsonSchema>([
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
