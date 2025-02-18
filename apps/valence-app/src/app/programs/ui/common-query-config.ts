"use client";
import { defaultQueryConfig, queryConfigSchema } from "@/app/programs/server";
import { parseAsJson, useQueryState } from "nuqs";

export const useQueryArgs = () => {
  const [queryConfig, setQueryConfig] = useQueryState(
    "queryConfig",
    parseAsJson(queryConfigSchema.parse).withDefault(defaultQueryConfig),
  );

  return { queryConfig, setQueryConfig };
};
