import { getChainId } from "@/const";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { StargateClient } from "@cosmjs/stargate";

const getRpcUrl = (chainId: string) => {
  const urls = {
    "neutron-1": "https://rpc-lb.neutron.org",
    "pion-1": "https://rpc-falcron.pion-1.ntrn.tech",
  };
  return urls[chainId];
};

export const getStargateClient = async (rpc?: string) => {
  try {
    const chainId = getChainId();
    const defaultRpc = getRpcUrl(chainId);
    return StargateClient.connect(rpc ?? defaultRpc);
  } catch (e) {
    throw ErrorHandler.makeError(ERROR_MESSAGES.STARGATE_CONNECT_FAIL, e);
  }
};

export const getCosmwasmClient = async (rpc?: string) => {
  try {
    const chainId = getChainId();
    const defaultRpc = getRpcUrl(chainId);
    const cosmwasn = await CosmWasmClient.connect(rpc ?? defaultRpc);
    return cosmwasn;
  } catch (e) {
    throw ErrorHandler.makeError(ERROR_MESSAGES.COSMWASM_CONNECT_FAIL, e);
  }
};
