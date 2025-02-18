import { type NormalizedAccounts } from "@/app/programs/server";
import { chains } from "chain-registry";
import {
  getDefaultMainChainConfig,
  getPreferredRpcs,
} from "@/app/programs/server/config";
import { z } from "zod";
import { parseAsJson, createLoader } from "nuqs/server";

export type QueryConfig = {
  main: {
    registryAddress?: string;
    chainId: string;
    rpcUrl: string;
    name: string;
  };
  external: Array<{
    rpc: string;
    chainId: string;
    name: string;
  }>;
};

export const queryConfigSchema = z.object({
  main: z.object({
    registryAddress: z.string().optional(),
    chainId: z.string(),
    rpcUrl: z.string(),
    name: z.string(),
  }),
  external: z.array(
    z.object({
      rpc: z.string(),
      chainId: z.string(),
      name: z.string(),
    }),
  ),
});

export const defaultQueryConfig = {
  main: getDefaultMainChainConfig(),
  external: [], // needs to be derived from accounts in config
};

export const queryConfigSearchParams = {
  queryConfig: parseAsJson(queryConfigSchema.parse).withDefault(
    defaultQueryConfig,
  ),
};
export const loadSearchParams = createLoader(queryConfigSearchParams);

type RequiredMain = Required<Pick<QueryConfig, "main">>;
type OptionalExternal = Partial<Pick<QueryConfig, "external">>;
type WorkingQueryConfig = RequiredMain &
  OptionalExternal &
  Omit<QueryConfig, "main" | "external">;

export class QueryConfigManager {
  // 'main' is requied but temp can be undefined
  private mainChainConfig: QueryConfig["main"];
  private externalChainConfig?: QueryConfig["external"];

  constructor(workingConfig: WorkingQueryConfig) {
    this.mainChainConfig = workingConfig.main;

    if (workingConfig.external) {
      this.externalChainConfig = workingConfig.external;
    }
  }

  getMainChainConfig() {
    return this.mainChainConfig;
  }

  setAllChainsConfigIfEmpty(accounts: NormalizedAccounts) {
    // if query config already specified, we dont have to make it ourselves.
    if (this.externalChainConfig?.length) return;
    else
      this.externalChainConfig = QueryConfigManager.makeExternalChainConfig(
        accounts,
        this.mainChainConfig.chainId,
      );
  }

  getQueryConfig(): QueryConfig {
    if (!this.externalChainConfig) {
      // this is to catch errors during development.
      throw new Error(
        "All chains config not set. Please call setAllChainsConfigIfEmpty before calling getQueryConfig",
      );
    }
    return {
      main: this.mainChainConfig,
      external: this.externalChainConfig,
    };
  }

  // takes list of accounts and default rpcs and makes rpc config object
  private static makeExternalChainConfig(
    accounts: NormalizedAccounts,
    mainChainId: string,
  ): QueryConfig["external"] {
    const rpcs: QueryConfig["external"] = [];

    for (const account of Object.values(accounts)) {
      // if already present, skip
      if (rpcs.find((rpc) => rpc.chainId === account.chainId)) continue;

      let rpcUrl;
      const preferredRpcs = getPreferredRpcs();
      if (account.chainId in preferredRpcs) {
        rpcUrl = preferredRpcs[account.chainId];
      } else {
        const registeredChain = chains.find(
          (chain) => chain.chain_id === account.chainId,
        );
        if (!registeredChain) {
          throw new Error(
            `Unable to set default rpc. Chain id ${account.chainId} not found in chain registry.`,
          );
        }
        const registeredEndpoint = registeredChain.apis?.rpc?.[0];
        if (!registeredEndpoint) {
          throw new Error(
            `Unable to set default rpc. Registered chain ${account.chainId} does not have an rpc endpoint.`,
          );
        }
        rpcUrl = registeredEndpoint.address;
      }
      if (account.chainId !== mainChainId) {
        rpcs.push({
          rpc: rpcUrl,
          chainId: account.chainId,
          name: account.chainName,
        });
      }
    }
    return rpcs;
  }
}
