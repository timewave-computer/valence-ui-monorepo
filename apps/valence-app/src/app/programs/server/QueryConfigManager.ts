import { type NormalizedAccounts } from "@/app/programs/server";
import { chains } from "chain-registry";
import { preferredRpcs } from "@/app/programs/const/config";

export type QueryConfig = {
  main: {
    registryAddress: string;
    chainId: string;
    rpc: string;
  };
  allChains: Array<{
    rpc: string;
    chainId: string;
    crosschain: boolean;
  }>;
};

type RequiredMain = Required<Pick<QueryConfig, "main">>;
type OptionalAllChain = Partial<Pick<QueryConfig, "allChains">>;
type WorkingQueryConfig = RequiredMain &
  OptionalAllChain &
  Omit<QueryConfig, "main" | "allChains">;

export class QueryConfigManager {
  // 'main' is requied but temp can be undefined
  private mainChainConfig: QueryConfig["main"];
  private allChainConfig?: QueryConfig["allChains"];

  constructor(workingConfig: WorkingQueryConfig) {
    this.mainChainConfig = workingConfig.main;
    if (workingConfig.allChains) {
      this.allChainConfig = workingConfig.allChains;
    }
  }

  getMainChainConfig() {
    return this.mainChainConfig;
  }

  setAllChainsConfigIfEmpty(accounts: NormalizedAccounts) {
    // if query config already specified, we dont have to make it ourselves.
    if (this.allChainConfig?.length) return;
    else
      this.allChainConfig = QueryConfigManager.makeAllChainsConfig(
        accounts,
        this.mainChainConfig.chainId,
      );
  }

  getQueryConfig(): QueryConfig {
    if (!this.allChainConfig) {
      // this is to catch errors during development.
      throw new Error(
        "All chains config not set. Please call setAllChainsConfigIfEmpty before calling getQueryConfig",
      );
    }
    return {
      main: this.mainChainConfig,
      allChains: this.allChainConfig,
    };
  }

  // takes list of accounts and default rpcs and makes rpc config object
  private static makeAllChainsConfig(
    accounts: NormalizedAccounts,
    mainChainId: string,
  ): QueryConfig["allChains"] {
    const rpcs: QueryConfig["allChains"] = [];

    for (const account of Object.values(accounts)) {
      // if already present, skip
      if (rpcs.find((rpc) => rpc.chainId === account.chainId)) continue;

      let rpcUrl;
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
      rpcs.push({
        rpc: rpcUrl,
        chainId: account.chainId,
        crosschain: account.chainId !== mainChainId,
      });
    }
    return rpcs;
  }
}
