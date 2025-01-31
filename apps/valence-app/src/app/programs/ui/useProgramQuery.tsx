"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const";
import {
  type QueryConfig,
  getProgramData,
  type GetProgramDataReturnValue,
} from "@/app/programs/server";
import { LinkText, ToastMessage, toast } from "@valence-ui/ui-components";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { X_HANDLE, X_URL } from "@valence-ui/socials";
import { isEqual } from "lodash";

export const DEFAULT_QUERY_CONFIG: QueryConfig = {
  main: {
    chainId: "",
    rpc: "",
    registryAddress: "",
    name: "",
  },
  external: [],
};

export const queryArgsAtom = atom<QueryConfig>(DEFAULT_QUERY_CONFIG);

export const useQueryArgs = () => {
  return useAtom(queryArgsAtom);
};

type UseProgramQueryArgs = {
  programId: string;
  initialQueryData: GetProgramDataReturnValue;
};
export const useProgramQuery = ({
  programId,
  initialQueryData,
}: UseProgramQueryArgs) => {
  const [queryConfig] = useAtom(queryArgsAtom);

  // must be defined in callback to detect input changes
  const queryFn = useCallback(async () => {
    // nullify initial data after first fetch, otherwise it will be used for every response
    try {
      const data = await getProgramData({
        programId,
        queryConfig,
      });
      // return the partial result. it contains errors
      return data;
    } catch (e) {
      // catch if it just totally fails
      console.log("Failed to fetch", e);
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
  }, [programId, queryConfig.main, queryConfig.external]);
  return useQuery<GetProgramDataReturnValue | undefined>({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    queryKey: [
      QUERY_KEYS.PROGRAMS_FETCH_PROGRAM,
      queryConfig.external,
      queryConfig.main,
      programId,
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
