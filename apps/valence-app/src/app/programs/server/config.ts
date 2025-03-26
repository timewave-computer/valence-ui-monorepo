import { ProgramQueryConfig } from "@/app/programs/server";
import { publicProgramsConfig } from "@valence-ui/programs-config";

export const defaultDomainName = publicProgramsConfig.main.domainName;
export const getDefaultMainChainConfig = (): ProgramQueryConfig["main"] => {
  const neutronConfig = publicProgramsConfig.main;
  return {
    chainId: neutronConfig.chainId,
    registryAddress: publicProgramsConfig.registry,
    rpc: neutronConfig.rpc,
    domainName: neutronConfig.domainName,
    chainName: neutronConfig.chainName,
  };
};
