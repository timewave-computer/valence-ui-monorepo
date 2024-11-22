import { mockRegistry } from "@/mock-data";

// TODO: take registry ID
export const getProgram = async (programId: string) => {
  if (!(programId in mockRegistry))
    throw new Error(`Program ${programId} found in registry`);
  return Promise.resolve(mockRegistry[programId]);
};
