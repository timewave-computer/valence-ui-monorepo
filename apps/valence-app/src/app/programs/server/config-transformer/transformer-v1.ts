import { TransformerFunction } from "./types";

export interface ManagerConfigV1 {}

export const transformerV1: TransformerFunction = (config: ManagerConfigV1) => {
  return {
    edges: [],
    nodes: [],
  };
};
