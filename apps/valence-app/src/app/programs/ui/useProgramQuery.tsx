import { ProgramDiagramProps } from "@/app/programs/ui";
import { createStore, useStore } from "zustand";
import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const";
import { QueryConfig } from "../server";

export const createQueryArgsStore = (initProps: QueryConfig) => {
  return createStore<QueryConfig>()((set) => ({
    ...initProps,
    setQueryConfig: (newQueryConfig: QueryConfig) => set(newQueryConfig),
  }));
};

type QueryArgsStore = ReturnType<typeof createQueryArgsStore>;

export const ProgramQueryArgsContext = createContext<QueryArgsStore | null>(
  null,
);

const useQueryArgsStore = () => {
  const store = useContext(ProgramQueryArgsContext);
  if (!store)
    throw new Error(
      "useQueryArgsStore must be used within a ProgramQueryArgsContext.Provider",
    );
  return useStore(store);
};

type UseProgramQueryArgs = {
  initialData: ProgramDiagramProps["initialData"];
};
export const useProgramQuery = ({ initialData }: UseProgramQueryArgs) => {
  const { programId, registryAddress, rpcs, setRegistryAndRpcs } =
    useQueryArgsStore();
  console.log("programId", programId);

  const { data, error, isLoading } = useQuery({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: [QUERY_KEYS.PROGRAMS_FETCH_PROGRAM],
    refetchInterval: 30 * 1000, // 30 seconds

    queryFn: () => {
      // TODO: make server function that returns this data
      // return data
      // consume in graph
      console.log("fetching");
      return true;
    },
  });
};
