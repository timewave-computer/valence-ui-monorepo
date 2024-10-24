"use client";
import { ChainProvider } from "@cosmos-kit/react-lite";
import { wallets } from "@cosmos-kit/keplr";
import { ReactNode } from "react";
import { chainConfig } from "@/const/config";
import { SignerOptions, WalletModalProps } from "@cosmos-kit/core";
import { AminoTypes, GasPrice } from "@cosmjs/stargate";
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
/***
 * only the small amount of types we need, extracted from telescope codegen
 */
import { protoRegistry } from "@/smol_telescope/proto-registry";
import { aminoConverters } from "@/smol_telescope/amino-converters";

const protobufTypes: ReadonlyArray<[string, GeneratedType]> = [
  ...protoRegistry,
];
export const protobufRegistry = new Registry(protobufTypes);

export const aminoTypes = new AminoTypes({
  ...aminoConverters,
});

const signerOptions: SignerOptions = {
  preferredSignType: () => "amino",
  signingStargate: () => {
    return {
      gasPrice: GasPrice.fromString("0.001untrn"), // TODO: fetch dynamically
      registry: protobufRegistry,
      aminoTypes: aminoTypes,
    };
  },
  signingCosmwasm: () => {
    return {
      gasPrice: GasPrice.fromString("0.001untrn"),
      registry: protobufRegistry,
      aminoTypes: aminoTypes,
    };
  },
};

const ENABLED_WALLETS = [wallets[0]]; // only keplr web, not mobile
export const CosmosProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <ChainProvider
      walletModal={WalletModal} // temporarily is a no-op
      chains={[chainConfig.chain]}
      assetLists={chainConfig.assets}
      wallets={ENABLED_WALLETS}
      signerOptions={signerOptions}
      // endpointOptions={{}}
      // walletConnectOptions={...} // required if `wallets` contains mobile wallets
    >
      {children}
    </ChainProvider>
  );
};

const WalletModal = (props: WalletModalProps) => {
  // would be opened with {openView} = useChain()
  return <></>;
};
