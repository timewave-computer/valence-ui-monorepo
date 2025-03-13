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
import { neutron, juno, osmosis, cosmoshub } from "graz/chains";

const protobufTypes: ReadonlyArray<[string, GeneratedType]> = [
  ...protoRegistry,
];
export const protobufRegistry = new Registry(protobufTypes);

export const aminoTypes = new AminoTypes({
  ...aminoConverters,
});

export const CosmosProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // note, must be wrapped in query client provider
  return (
    <GrazProvider
      grazOptions={{
        chains: [neutron, juno, osmosis, cosmoshub],
      }}
    >
      {children}
    </GrazProvider>
  );
};
