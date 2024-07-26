import { getChainId, SupportedChainId } from "@/const/config";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { StargateClient } from "@cosmjs/stargate";
let NEUTRON_RPC = process.env.COSMOS_RPC_URL;
if (!NEUTRON_RPC) throw new Error("Please provide COSMOS_RPC_URL");

const RpcConfig: Record<SupportedChainId, string> = {
  "neutron-1": NEUTRON_RPC,
  "pion-1": "https://pion-rpc.polkachu.com/",
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
