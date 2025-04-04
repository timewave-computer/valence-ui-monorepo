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
