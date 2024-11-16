import { type Edge, type Node } from "@xyflow/react";

export interface TransformerOutput {
  nodes: Node[];
  edges: Edge[];
}

export type TransformerFunction<T> = (config: T) => TransformerOutput;
