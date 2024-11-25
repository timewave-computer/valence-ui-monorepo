import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { StargateClient } from "@cosmjs/stargate";

export const getStargateClient = async (rpc: string) => {
  try {
    return StargateClient.connect(rpc);
  } catch (e) {
    throw ErrorHandler.makeError(ERROR_MESSAGES.STARGATE_CONNECT_FAIL, e);
  }
};

export const getCosmwasmClient = async (rpc: string) => {
  try {
    const stargate = await CosmWasmClient.connect(rpc);
    return stargate;
  } catch (e) {
    throw ErrorHandler.makeError(ERROR_MESSAGES.STARGATE_CONNECT_FAIL, e);
  }
};
