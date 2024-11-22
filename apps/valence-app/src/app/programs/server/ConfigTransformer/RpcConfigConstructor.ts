import {
  type NormalizedAccounts,
  type NormalizedRpcConfig,
} from "@/app/programs/server";
import { NEUTRON_RPC } from "@/server/utils";
import { chains } from "chain-registry";

const defaultMainChainConfig = {
  chainId: "neutron-1",
};

export class RpcConfigConstructor {
  // takes list of accounts and default rpcs and makes rpc config object
  public static create(accounts: NormalizedAccounts): NormalizedRpcConfig {
    const rpcConfig: NormalizedRpcConfig = [];

    for (const account of Object.values(accounts)) {
      if (rpcConfig.find((rpc) => rpc.chainId === account.chainId)) continue;
      let rpcUrl;
      if (account.chainId in PreferredRpcs) {
        rpcUrl = PreferredRpcs[account.chainId];
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
      rpcConfig.push({
        rpc: rpcUrl,
        chainId: account.chainId,
        main: account.chainId === defaultMainChainConfig.chainId,
      });
    }
    return rpcConfig;
  }
}

const PreferredRpcs = {
  "neutron-1": NEUTRON_RPC,
};
