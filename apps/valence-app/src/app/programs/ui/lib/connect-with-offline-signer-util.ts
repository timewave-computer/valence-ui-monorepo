"use client";

import { aminoTypes, protobufRegistry } from "@/context";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { chains } from "chain-registry";
import { ChainInfo } from "@keplr-wallet/types";

declare global {
  interface Window {
    keplr?: any;
    getOfflineSigner: (chainId: string) => Promise<OfflineSigner | undefined>;
  }
}

const { keplr } = window;

export type ConnectWithOfflineSignerInput = {
  chainId: string;
  chainName: string;
  rpcUrl: string;
  offlineSigner?: OfflineSigner;
};

export const connectWithOfflineSigner = async ({
  chainId,
  chainName,
  rpcUrl,
  offlineSigner,
}: ConnectWithOfflineSignerInput) => {
  if (!keplr) {
    throw new Error(
      "Keplr is unavailable. Please log in or install the extension. Support for more wallets will be added soon.",
    );
  }

  const registeredChain = chains.find((c) => c.chain_id === chainId);
  if (!registeredChain) {
    const testChainInfo = getTestnetChainInfo({
      chainId,
      chainName,
      rpcUrl,
    });
    await keplr.experimentalSuggestChain(testChainInfo);
  }
  await keplr.enable(chainId);

  if (!offlineSigner) {
    throw new Error(
      `Unable to initialize signer for ${chainId} at ${rpcUrl}. Reconnect and try again.`,
    );
  }

  const registeredFeeTokens = registeredChain?.fees?.fee_tokens;
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
