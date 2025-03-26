import { publicProgramsConfig } from "@valence-ui/programs-config";

export class PublicProgramsConfig {
  public static get() {
    return publicProgramsConfig;
  }
  public static getConfigByDomainName(domainName: string) {
    if (publicProgramsConfig.main.domainName === domainName) {
      return publicProgramsConfig.main;
    } else {
      return publicProgramsConfig.chains.find(
        (chain) => chain.domainName === domainName,
      );
    }
  }
}
