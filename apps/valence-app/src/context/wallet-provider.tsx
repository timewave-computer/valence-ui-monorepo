"use client";
import { ReactNode } from "react";
import { AminoTypes } from "@cosmjs/stargate";
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
/***
 * only the small amount of types we need, extracted from telescope codegen
 */
import { protoRegistry } from "@/smol_telescope/proto-registry";
import { aminoConverters } from "@/smol_telescope/amino-converters";
import { GrazProvider } from "graz";
import { atom, useAtom } from "jotai";
import { ChainInfo } from "@keplr-wallet/types";
import { programsSupportedChains } from "@/const";

const protobufTypes: ReadonlyArray<[string, GeneratedType]> = [
  ...protoRegistry,
];
export const protobufRegistry = new Registry(protobufTypes);

export const aminoTypes = new AminoTypes({
  ...aminoConverters,
});

const grazSupportedChainsAtom = atom<Array<ChainInfo>>(programsSupportedChains);
export const useSupportedChains = () => {
  return useAtom(grazSupportedChainsAtom);
};

export const CosmosProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // note, must be wrapped in react query client provider

  const [programsSupportedChains] = useSupportedChains();
  return (
    <GrazProvider
      grazOptions={{
        chains: programsSupportedChains,
        chainsConfig: {
          "neutron-1": {
            gas: {
              price: "0.005",
              denom: "untrn",
            },
          },
        },
      }}
    >
      {children}
    </GrazProvider>
  );
};
