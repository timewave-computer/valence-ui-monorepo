import {
  type ProgramLibrary,
  type ProgramAccount,
  type ProgramLink,
} from "@/types";
import { type Edge } from "@xyflow/react";

export const managerConfigToDiagram = (program) => {
  return { nodes, edges };
};
export type ManagerConfigToDiagram = ReturnType<typeof managerConfigToDiagram>;
