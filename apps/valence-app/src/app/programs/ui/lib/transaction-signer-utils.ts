"use client";

import { aminoTypes, protobufRegistry } from "@/context";
import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { ChainInfo } from "@keplr-wallet/types";

//@ts-ignore
const { keplr } = window;

export const connectWithSigner = async ({
  chainId,
  rpcUrl,
  chainName,
}: {
  chainId: string;
  chainName: string;
  rpcUrl: string;
}) => {
  const testChainInfo = getTestnetChainInfo({
    chainId,
    chainName,
    // chainName: "localneutron-1",
    rpcUrl,
  });

  await keplr.experimentalSuggestChain(testChainInfo);
  await keplr.enable("localneutron-1");

  //@ts-ignore
  const offlineSigner = window.getOfflineSigner!("localneutron-1");

  return SigningStargateClient.connectWithSigner(
    testChainInfo.rpc,
    offlineSigner,
    {
      gasPrice: GasPrice.fromString("0.001untrn"),
      registry: protobufRegistry,
      aminoTypes: aminoTypes,
    },
  );
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
    chainId: `${chainId}`,
    chainName: `${chainName}`,
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
