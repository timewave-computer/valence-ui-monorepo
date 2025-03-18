import { chains } from "chain-registry";
import { z } from "zod";
import { parseAsJson, createLoader } from "nuqs/server";

export const queryConfigSchema = z.object({
  main: z.object({
    registryAddress: z.string().optional(),
    chainId: z.string(),
    rpc: z.string(),
    chainName: z.string(),
    domainName: z.string(),
  }),
  external: z
    .array(
      z.object({
        rpc: z.string(),
        chainId: z.string(),
        domainName: z.string(),
        chainName: z.string(),
      }), // note: cannot be optional, it wont be detected by nuqs
    )
    .nullable(),
});
export type ProgramQueryConfig = z.infer<typeof queryConfigSchema>;

const queryConfigLoader = {
  queryConfig: parseAsJson(queryConfigSchema.parse),
};
export const loadQueryConfigSearchParams = createLoader(queryConfigLoader);

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
    // TODO: maybe carry over the rest of user args?

    return externalProgramDomains.map((domain) => {
      const userSuppliedChain = userSuppliedQueryConfig.external?.find(
        (config) => {
          return config.domainName === domain;
        },
      );
      return {
        rpc: userSuppliedChain?.rpc || "",
        chainId: userSuppliedChain?.chainId || "",
        domainName: domain,
        chainName: userSuppliedChain?.chainName || "",
      };
    });
  } else {
    // make from defaults
    return externalProgramDomains.map((domain) => {
      const registeredChain = chains.find((chain) => {
        return chain.chain_name === domain;
      });

      const rpcUrl = registeredChain?.apis?.rpc?.[0]?.address || "";
      return {
        rpc: rpcUrl,
        chainId: registeredChain?.chain_id || "",
        domainName: domain,
        chainName: registeredChain?.chain_name || "",
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
