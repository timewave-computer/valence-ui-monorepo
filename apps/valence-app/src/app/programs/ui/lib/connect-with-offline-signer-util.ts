"use client";

import { aminoTypes, protobufRegistry } from "@/context";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { chains } from "chain-registry";

export type ConnectWithOfflineSignerInput = {
  chainId: string;
  rpcUrl: string;
  offlineSigner?: OfflineSigner;
};

export const connectWithOfflineSigner = async ({
  chainId,
  rpcUrl,
  offlineSigner,
}: ConnectWithOfflineSignerInput) => {
  const registeredChain = chains.find((c) => c.chain_id === chainId);
  if (!registeredChain) {
    throw new Error(`Chain ID ${chainId} is not supported.`);
  }

  if (!offlineSigner) {
    throw new Error(
      `Unable to initialize signer for ${chainId} at ${rpcUrl}. Reconnect and try again.`,
    );
  }

  const registeredFeeTokens = registeredChain.fees?.fee_tokens;
  const feeDenom = registeredFeeTokens ? registeredFeeTokens[0].denom : "untrn";

  try {
    return SigningStargateClient.connectWithSigner(rpcUrl, offlineSigner, {
      // TODO: do not hardcode the quantity, handle denom more nicely / accept chain info as input
      gasPrice: GasPrice.fromString(`0.005${feeDenom}`),
      registry: protobufRegistry,
      aminoTypes: aminoTypes,
    });
  } catch (e) {
    console.log(
      "Error connecting with offline signer",
      e.message,
      JSON.stringify(e),
    );
    throw new Error(
      `Connected wallet unable to connect with signer at ${rpcUrl}. Make sure the RPC endpoint supports CORS. Error: ${e.message}`,
    );
  }
};
