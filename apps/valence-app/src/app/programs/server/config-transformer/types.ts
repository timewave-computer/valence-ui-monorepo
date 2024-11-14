import { type Edge, type Node } from "@xyflow/react";

export interface TransformerOutput {
  nodes: Node[];
  edges: Edge[];
}

export type TransformerFunction = (config: unknown) => TransformerOutput;
