"use client";
import {
  GetProgramDataReturnValue,
  queryConfigSchema,
} from "@/app/programs/server";
import { parseAsJson, useQueryState } from "nuqs";

export const useQueryArgs = (
  initialQueryConfig: GetProgramDataReturnValue["queryConfig"],
) => {
  console.log("using initial query args", initialQueryConfig);
  const [queryConfig, setQueryConfig] = useQueryState(
    "queryConfig",
    parseAsJson(queryConfigSchema.parse).withDefault(initialQueryConfig),
  );

  return { queryConfig, setQueryConfig };
};
