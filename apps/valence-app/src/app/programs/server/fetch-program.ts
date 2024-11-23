import { mockRegistry } from "@/mock-data";

export const fetchProgram = async ({
  programId,
  registryAddress,
}: {
  programId: string;
  registryAddress: string;
}) => {
  // TODO: fetch from actual registry
  if (!(programId in mockRegistry))
    throw new Error(`Program ${programId} found in registry`);
  return Promise.resolve(mockRegistry[programId]);
};
