import { getChainId, SupportedChainId } from "@/const/config";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { StargateClient } from "@cosmjs/stargate";
let NEUTRON_RPC = process.env.NEUTRON_RPC_URL;
if (!NEUTRON_RPC) throw new Error("Please provide NEUTRON_RPC_URL");

export const RpcConfig: Record<SupportedChainId, string> = {
  "neutron-1": NEUTRON_RPC,
  "pion-1": "https://rpc-falcron.pion-1.ntrn.tech",
};

export const getStargateClient = async (rpc?: string) => {
  try {
    const chainId = getChainId();
    const defaultRpc = RpcConfig[chainId];
    const stargate = await StargateClient.connect(rpc ?? defaultRpc);
    return stargate;
  } catch (e) {
    throw ErrorHandler.makeError(ERROR_MESSAGES.STARGATE_CONNECT_FAIL, e);
  }
};

export const getCosmwasmClient = async (rpc?: string) => {
  try {
    const chainId = getChainId();
    const defaultRpc = RpcConfig[chainId];
    const stargate = await CosmWasmClient.connect(rpc ?? defaultRpc);
    return stargate;
  } catch (e) {
    throw ErrorHandler.makeError(ERROR_MESSAGES.STARGATE_CONNECT_FAIL, e);
  }
};
