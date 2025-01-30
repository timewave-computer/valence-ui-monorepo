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
import { X_URL } from "@valence-ui/socials";

export const DEFAULT_QUERY_CONFIG: QueryConfig = {
  main: {
    chainId: "",
    rpc: "",
    registryAddress: "",
    name: "",
  },
  allChains: [],
};

// initialized with Provider on render
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
          Refresh the page and contanct{" "}
          <LinkText href={X_URL} variant="primary">
            @Valence.Zone
          </LinkText>{" "}
          if the problem persists.
        </ToastMessage>,
      );
    }
  }, [programId, queryConfig.main, queryConfig.allChains]);
  return useQuery<GetProgramDataReturnValue | undefined>({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    queryKey: [QUERY_KEYS.PROGRAMS_FETCH_PROGRAM, queryConfig, programId],
    initialData: initialQueryData,
    refetchInterval: 0,
    staleTime: 0, // must be 0 in order for data to refetch if query params change (???)
    queryFn,
  });
};
