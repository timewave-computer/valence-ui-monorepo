import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { StargateClient } from "@cosmjs/stargate";

const DEFAULT_RPC_URL = process.env.COSMOS_RPC_URL;
if (!DEFAULT_RPC_URL) throw new Error("Please provide COSMOS_RPC_URL");

export const getStargateClient = async (rpc?: string) => {
  try {
    const stargate = await StargateClient.connect(rpc ?? DEFAULT_RPC_URL);
    return stargate;
  } catch (e) {
    throw ErrorHandler.makeError(ERROR_MESSAGES.STARGATE_CONNECT_FAIL, e);
  }
};
