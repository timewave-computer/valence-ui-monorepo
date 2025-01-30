"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const";
import {
  type QueryConfig,
  isErrorResponse,
  getProgramData,
  type GetProgramDataReturnValue,
} from "@/app/programs/server";
import { ToastMessage, toast } from "@valence-ui/ui-components";
import { atom, useAtom } from "jotai";

// initialized with Provider on render
export const queryArgsAtom = atom<QueryConfig>({
  main: {
    chainId: "",
    rpc: "",
    registryAddress: "",
    name: "",
  },
  allChains: [],
});

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
  return useQuery<GetProgramDataReturnValue | undefined>({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    queryKey: [QUERY_KEYS.PROGRAMS_FETCH_PROGRAM, queryConfig, programId],
    refetchInterval: 30 * 1000, // 30 seconds
    initialData: initialQueryData,
    staleTime: 0,
    queryFn: async () => {
      const data = await getProgramData({
        programId,
        queryConfig,
        throwError: false,
      });
      if (isErrorResponse(data)) {
        toast.error(
          <ToastMessage variant="error" title={data.message}>
            {data.error}
          </ToastMessage>,
        );
        throw new Error(data.message);
      }

      // this is a temporary solution. ideally it can be derived through a type guard
      return data as GetProgramDataReturnValue;
    },
  });
};
