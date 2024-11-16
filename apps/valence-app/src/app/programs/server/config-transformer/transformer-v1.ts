import { z } from "zod";
import { TransformerFunction } from "./types";
import { programConfigSchema } from "@valence-ui/generated-types";
export interface ManagerConfigV1 {}

type ProgramConfigV1 = z.infer<typeof programConfigSchema>;
export const transformerV1: TransformerFunction<ProgramConfigV1> = (config) => {
  console.log(config.accounts);
  return {
    edges: [],
    nodes: [],
  };
};
