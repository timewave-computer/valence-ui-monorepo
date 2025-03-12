"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const";
import {
  getProgramData,
  type GetProgramDataReturnValue,
} from "@/app/programs/server";
import { LinkText, ToastMessage, toast } from "@valence-ui/ui-components";
import { useCallback } from "react";
import { X_HANDLE, X_URL } from "@valence-ui/socials";
import { isEqual } from "lodash";
import { useQueryArgs } from "@/app/programs/ui";

type UseProgramQueryArgs = {
  programId: string;
  initialQueryData?: GetProgramDataReturnValue;
};

export const useProgramQuery = ({
  programId,
  initialQueryData,
}: UseProgramQueryArgs) => {
  const { queryConfig } = useQueryArgs(initialQueryData?.queryConfig!);

  // must be defined in callback to detect input changes
  const queryFn = useCallback(async () => {
    // nullify initial data after first fetch, otherwise it will be used for every response
    try {
      const data = await getProgramData({
        programId,
        queryConfig: {
          main: queryConfig.main,
          external: queryConfig.external,
        },
      });
      // return the partial result. it contains errors
      return data;
    } catch (e) {
      // catch if it just totally fails
      console.log("Failed to fetch program", e);
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
  }, [programId, queryConfig?.main, queryConfig?.external]);
  return useQuery<GetProgramDataReturnValue | undefined>({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!queryConfig,
    retry: false,
    queryKey: [
      QUERY_KEYS.PROGRAMS_FETCH_PROGRAM,
      programId,
      queryConfig?.main,
      queryConfig?.external,
    ],
    // only supply initial data if the query config is the same
    initialData: isEqual(queryConfig, initialQueryData?.queryConfig)
      ? initialQueryData
      : undefined,
    refetchInterval: 30 * 1000,
    staleTime: 60 * 1000, // 60s
    queryFn,
    // IMPORTANT, so react-query knows when to no longer use initialData and fetch instead
    initialDataUpdatedAt: initialQueryData?.dataLastUpdatedAt,
  });
};
