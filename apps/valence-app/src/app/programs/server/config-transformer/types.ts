import { ProgramConfig } from "@valence-ui/generated-types";
import { type Edge, type Node } from "@xyflow/react";

// we only have 1 format so its ok for now
export type NormalizedAuthorization = ProgramConfig["authorizations"][0];
export type NormalizedAuthorizationData = ProgramConfig["authorization_data"];

export interface TransformerOutput {
  nodes: Node[];
  edges: Edge[];
  authorizations: NormalizedAuthorization[];
  authorizationData: NormalizedAuthorizationData;
  programId: string;
}

export type TransformerFunction<T> = (config: T) => TransformerOutput;
