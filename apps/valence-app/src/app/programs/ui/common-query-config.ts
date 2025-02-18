import { QueryConfig } from "@/app/programs/server";
import { atom, useAtom } from "jotai";

export const DEFAULT_QUERY_CONFIG: QueryConfig = {
  main: {
    chainId: "",
    rpcUrl: "",
    registryAddress: "",
    name: "",
  },
  external: [],
};

export const queryArgsAtom = atom<QueryConfig>(DEFAULT_QUERY_CONFIG);

export const useQueryArgs = () => {
  return useAtom(queryArgsAtom);
};
