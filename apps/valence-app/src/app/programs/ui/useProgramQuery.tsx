"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const";
import {
  type QueryConfig,
  getProgramData,
  type GetProgramDataReturnValue,
} from "@/app/programs/server";
import { ToastMessage, toast } from "@valence-ui/ui-components";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

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

const isHasErrors = (data: GetProgramDataReturnValue | undefined) => {
  return Object.keys(data?.errors ?? {}).length > 0;
};

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
      const balanaceErrors = data.errors?.BALANCES;
      const registryErrors = data.errors?.REGISTRY;
      if (registryErrors || balanaceErrors) {
        toast.error(
          <ToastMessage title={"Failed RPC Request"} variant="error">
            {registryErrors?.message}
            {balanaceErrors?.message}
          </ToastMessage>,
        );
      }
      // still return the partial result
      return data;
    } catch (e) {
      console.log("Failed to fetch", e);
      throw new Error("Failed to fetch");
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
