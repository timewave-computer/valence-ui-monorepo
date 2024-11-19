import { mockRegistry } from "@/mock-data/programs/program-registry";

export const getProgram = async (programId: string) => {
  if (!(programId in mockRegistry))
    throw new Error("Program not found in registry.");
  return Promise.resolve(mockRegistry[programId]);
};
