"use client";
import {
  GetProgramDataReturnValue,
  queryConfigSchema,
} from "@/app/programs/server";
import { parseAsJson, useQueryState } from "nuqs";

export const useQueryArgs = (
  initialQueryConfig: GetProgramDataReturnValue["queryConfig"],
) => {
  const [queryConfig, setQueryConfig] = useQueryState(
    "queryConfig",
    parseAsJson(queryConfigSchema.parse).withDefault({
      ...initialQueryConfig,
      external: initialQueryConfig.external ?? [],
    }),
  );

  return { queryConfig, setQueryConfig };
};
