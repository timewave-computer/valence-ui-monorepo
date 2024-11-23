import {
  type NormalizedAccounts,
  type NormalizedQueryConfig,
  type DefaultQueryConfig,
  preferredRpcs,
} from "@/app/programs/server";
import { chains } from "chain-registry";

export class QueryConfigConstructor {
  defaultConfig: DefaultQueryConfig;
  constructor(defaultConfig: DefaultQueryConfig) {
    this.defaultConfig = defaultConfig;
  }

  // takes list of accounts and default rpcs and makes rpc config object
  create(accounts: NormalizedAccounts): NormalizedQueryConfig {
    const rpcs: NormalizedQueryConfig["rpcs"] = [];

    for (const account of Object.values(accounts)) {
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
        main: account.chainId === this.defaultConfig.mainChainId,
      });
    }
    return {
      registryAddress: this.defaultConfig.registryAddress,
      rpcs: rpcs,
    };
  }
}
