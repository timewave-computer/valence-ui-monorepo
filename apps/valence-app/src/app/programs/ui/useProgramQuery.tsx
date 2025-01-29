"use client";
import { createStore, useStore } from "zustand";
import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const";
import {
  type QueryConfig,
  isErrorResponse,
  getProgramData,
  type GetProgramDataReturnValue,
} from "@/app/programs/server";
import { ToastMessage, toast } from "@valence-ui/ui-components";

interface QueryConfigProps {
  queryConfig: QueryConfig;
}
interface QueryConfigState extends QueryConfigProps {
  setQueryConfig: (newQueryConfig: QueryConfig) => void;
}

export type QueryArgsStore = ReturnType<typeof createQueryArgsStore>;

export const createQueryArgsStore = (initProps: {
  queryConfig: QueryConfig;
}) => {
  return createStore<QueryConfigState>()((set, get) => ({
    ...initProps,
    setQueryConfig: (newQueryConfig: QueryConfig) =>
      set({ queryConfig: newQueryConfig }),
  }));
};

export const ProgramQueryArgsContext = createContext<QueryArgsStore | null>(
  null,
);

export const useQueryArgsStore = () => {
  const store = useContext(ProgramQueryArgsContext);
  if (!store)
    throw new Error(
      "useQueryArgsStore must be used within a ProgramQueryArgsContext.Provider",
    );
  return useStore(store);
};

type UseProgramQueryArgs = {
  programId: string;
  initialQueryData: GetProgramDataReturnValue;
};
export const useProgramQuery = ({
  programId,
  initialQueryData,
}: UseProgramQueryArgs) => {
  const { queryConfig } = useQueryArgsStore();
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
