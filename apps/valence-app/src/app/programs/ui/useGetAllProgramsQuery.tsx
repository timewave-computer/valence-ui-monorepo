"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const";
import {
  type GetAllProgramsReturnValue,
  getAllProgramsFromRegistry,
} from "@/app/programs/server";
import { LinkText, ToastMessage, toast } from "@valence-ui/ui-components";
import { useCallback } from "react";
import { X_HANDLE, X_URL } from "@valence-ui/socials";
import { isEqual } from "lodash";
import { useProgramQueryConfig } from "@/app/programs/ui";

type UseProgramQueryArgs = {
  initialQueryData: GetAllProgramsReturnValue;
};
export const useGetAllProgramsQuery = ({
  initialQueryData,
}: UseProgramQueryArgs) => {
  const { queryConfig } = useProgramQueryConfig(initialQueryData.queryConfig);

  // must be defined in callback to detect input changes
  const queryFn = useCallback(async () => {
    // nullify initial data after first fetch, otherwise it will be used for every response
    try {
      const data = await getAllProgramsFromRegistry({
        queryConfig: {
          main: queryConfig.main,
          external: queryConfig.external,
        },
      });
      // return the partial result. it contains errors
      return data;
    } catch (e) {
      // catch if it just totally fails
      console.log("Failed to fetch programs", e);
      toast(
        <ToastMessage variant="error" title="Failed to fetch program">
          <div className="flex flex-row flex-wrap gap-0.5">
            Refresh the page and contact{" "}
            <LinkText href={X_URL} variant="primary">
              {X_HANDLE}
            </LinkText>
            if the problem persists.
          </div>
        </ToastMessage>,
      );
    }
  }, [queryConfig.main, queryConfig.external]);
  return useQuery<GetAllProgramsReturnValue | undefined>({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    queryKey: [
      QUERY_KEYS.PROGRAMS_REGISTRY_ALL_PROGRAMS,
      queryConfig.external,
      queryConfig.main,
    ],
    // only supply initial data if the query config is the same
    initialData: isEqual(queryConfig, initialQueryData?.queryConfig)
      ? initialQueryData
      : undefined,
    refetchInterval: 60 * 1000, // 1 min
    staleTime: 5 * 60 * 100, // 5 mins - will remain in cache
    queryFn,
    // IMPORTANT, so react-query knows when to no longer use initialData and fetch instead
    initialDataUpdatedAt: initialQueryData?.dataLastUpdatedAt,
  });
};
