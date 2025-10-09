import { programsChainConfig } from "@valence-ui/programs-config";

export class ProgramsChainConfig {
  public static get() {
    return programsChainConfig;
  }
  public static getConfigByDomainName(domainName: string) {
    if (programsChainConfig.main.domainName === domainName) {
      return programsChainConfig.main;
    } else {
      return programsChainConfig.chains.find(
        (chain) => chain.domainName === domainName,
      );
    }
  }

  public static getSupportedChainIds() {
    const chainIds = programsChainConfig.chains.map((chain) => chain.chainId);
    chainIds.push(programsChainConfig.main.chainId);
    return chainIds;
  }
}

export const PUBLIC_DEFAULT_NEUTRON_RPC = process.env
  .NEXT_PUBLIC_DEFAULT_NEUTRON_RPC as string;
if (
  !PUBLIC_DEFAULT_NEUTRON_RPC ||
  typeof PUBLIC_DEFAULT_NEUTRON_RPC !== "string"
) {
  throw new Error("NEXT_PUBLIC_DEFAULT_NEUTRON_RPC is not set");
}
