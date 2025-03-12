"use client";

import { aminoTypes, protobufRegistry } from "@/context";
import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { ChainInfo, OfflineAminoSigner } from "@keplr-wallet/types";
import { chains } from "chain-registry";
import { ConnectArgs, OfflineSigners, WalletType } from "graz";

export type ConnectWithOfflineSignerInput = {
  chainId: string;
  rpcUrl: string;
  offlineSigner?: OfflineAminoSigner;
};
export const connectWithOfflineSigner = async ({
  chainId,
  rpcUrl,

  offlineSigner,
}: ConnectWithOfflineSignerInput) => {
  if (!offlineSigner) {
    throw new Error(`Unable to initialize signer for ${chainId} at ${rpcUrl}`);
  }

  // const registeredChain = chains.find((c) => c.chain_id === chainId);
  // if (!registeredChain) {
  //   const testChainInfo = getTestnetChainInfo({
  //     chainId,
  //     chainName,
  //     rpcUrl,
  //   });
  //   await keplr.experimentalSuggestChain(testChainInfo);
  // }

  // await keplr.enable(chainId);

  const registeredFeeTokens = chains.find((c) => c.chain_id === chainId)?.fees
    ?.fee_tokens;
  if (!registeredFeeTokens || registeredFeeTokens.length === 0) {
    throw new Error(
      `Unable to select fee token for ${chainId}. Please contact valence team.`,
    );
  }
  const feeDenom = registeredFeeTokens[0].denom;

  if (!offlineSigner) {
    throw new Error(
      "Offline signer not initialized. Try reconnecting wallet, and contact valence team if issue persists.",
    );
  }

  try {
    return SigningStargateClient.connectWithSigner(rpcUrl, offlineSigner, {
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

const getTestnetChainInfo = ({
  chainId,
  chainName,
  rpcUrl,
}: {
  chainId: string;
  chainName: string;
  rpcUrl: string;
}): ChainInfo => {
  return {
    chainId: chainId,
    chainName: chainName,
    rpc: rpcUrl,
    rest: rpcUrl,
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "neutron",
      bech32PrefixAccPub: "neutron" + "pub",
      bech32PrefixValAddr: "neutron" + "valoper",
      bech32PrefixValPub: "neutron" + "valoperpub",
      bech32PrefixConsAddr: "neutron" + "valcons",
      bech32PrefixConsPub: "neutron" + "valconspub",
    },
    currencies: [
      {
        coinDenom: "NTRN",
        coinMinimalDenom: "untrn",
        coinDecimals: 6,
        coinGeckoId: "neutron-3",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "NTRN",
        coinMinimalDenom: "untrn",
        coinDecimals: 6,
        coinGeckoId: "neutron-3",
        gasPriceStep: {
          low: 1,
          average: 1,
          high: 1,
        },
      },
    ],
    stakeCurrency: {
      coinDenom: "NTRN",
      coinMinimalDenom: "untrn",
      coinDecimals: 6,
      coinGeckoId: "neutron-3",
    },
    features: ["ibc-transfer"],
  };
};
