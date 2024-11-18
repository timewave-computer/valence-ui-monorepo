import { mockProgram1 } from "@/mock-data";

export const getProgram = (programId: string) => {
  const registryResponse = mockProgram1.workflow;
  return registryResponse;
};
