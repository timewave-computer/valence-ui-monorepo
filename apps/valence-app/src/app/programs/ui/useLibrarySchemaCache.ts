import { QUERY_KEYS } from "@/const";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import {
  fetchLibrarySchema,
  type FetchLibrarySchemaReturnValue,
  type GetProgramDataReturnValue,
} from "@/app/programs/server";
import { useCallback } from "react";

// hook can be instantated at root client level and used via useCache
export const useInitializeLibrarySchemaCache = (
  _initialData: GetProgramDataReturnValue["librarySchemas"],
) => {
  const initialData = _initialData ?? {};
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
      return queryClient.getQueryData<FetchLibrarySchemaReturnValue>([
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
