import { z } from "zod";
import { parseAsJson, createLoader } from "nuqs/server";
import { ProgramsChainConfig } from "@/const/"; // must be direct import to avoid circular import error

const externalConfigSchema = z.array(
  z.object({
    rpc: z.string(),
    chainId: z.string(),
    domainName: z.string(),
    chainName: z.string(),
  }),
);
export const queryConfigSchema = z.object({
  main: z.object({
    chainId: z.string(),
    registryAddress: z.string().optional(),
    rpc: z.string(),
    domainName: z.string(),
    chainName: z.string(),
  }),
  external: externalConfigSchema.nullish(),
});

export type ExternalProgramQueryConfig = z.infer<typeof externalConfigSchema>;
export type ProgramQueryConfig = z.infer<typeof queryConfigSchema>;

const queryConfigLoader = {
  queryConfig: parseAsJson(queryConfigSchema.parse),
};
export const loadQueryConfigSearchParams = createLoader(queryConfigLoader);

export const defaultDomainName = ProgramsChainConfig.get().main.domainName;
export const getDefaultMainChainConfig = (): ProgramQueryConfig["main"] => {
  const config = ProgramsChainConfig.get();
  const neutronConfig = config.main;
  return {
    chainId: neutronConfig.chainId,
    registryAddress: config.registry,
    rpc: neutronConfig.rpc,
    domainName: neutronConfig.domainName,
    chainName: neutronConfig.chainName,
  };
};

export const makeExternalDomainConfig = ({
  externalProgramDomains,
  userSuppliedQueryConfig,
}: {
  externalProgramDomains: string[];
  userSuppliedQueryConfig?: ProgramQueryConfig;
}) => {
  if (externalProgramDomains.length === 0) {
    return [];
  } else if (userSuppliedQueryConfig?.external) {
    return externalProgramDomains.map((domain) => {
      const userSuppliedChain = userSuppliedQueryConfig.external?.find(
        (config) => {
          return config.domainName === domain;
        },
      );
      return {
        rpc: userSuppliedChain?.rpc ?? "",
        chainId: userSuppliedChain?.chainId ?? "",
        domainName: domain,
        chainName: userSuppliedChain?.chainName ?? "",
      };
    });
  } else {
    // make from defaults
    return externalProgramDomains.map((domain) => {
      const supportedChain = ProgramsChainConfig.getConfigByDomainName(domain);

      return {
        rpc: supportedChain?.rpc ?? "",
        chainId: supportedChain?.chainId ?? "",
        domainName: domain,
        chainName: supportedChain?.chainName ?? "",
      };
    });
  }
};

export const getDomainConfig = ({
  queryConfig,
  domainName,
}: {
  queryConfig: ProgramQueryConfig;
  domainName: string;
}) => {
  if (queryConfig.main.domainName === domainName) {
    return queryConfig.main;
  } else {
    return queryConfig.external?.find((config) => {
      return config.domainName === domainName;
    });
  }
};
