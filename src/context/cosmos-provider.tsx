"use client";
import { ChainProvider } from "@cosmos-kit/react-lite";
import { wallets } from "@cosmos-kit/keplr";
import { ReactNode } from "react";
import { chainConfig } from "@/const/config";
import { SignerOptions, WalletModalProps } from "@cosmos-kit/core";
import { AminoTypes, GasPrice } from "@cosmjs/stargate";
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import {
  cosmosAminoConverters,
  cosmwasmAminoConverters,
  cosmwasmProtoRegistry,
} from "@/codegen/telescope";

const protobufTypes: ReadonlyArray<[string, GeneratedType]> = [
  ...cosmwasmProtoRegistry,
];
export const protobufRegistry = new Registry(protobufTypes);

export const aminoTypes = new AminoTypes({
  ...cosmosAminoConverters,
  ...cosmwasmAminoConverters,
});

const signerOptions: SignerOptions = {
  preferredSignType: () => "amino",
  // cosmos-kit expects aminotypes from stargate 32.3. only the 'register' function is different, should have no impact
  // @ts-expect-error
  signingStargate: () => {
    return {
      gasPrice: GasPrice.fromString("0.001untrn"), // TODO: fetch dynamically
      registry: protobufRegistry,
      aminoTypes: aminoTypes,
    };
  },
  // cosmos-kit expects aminotypes from stargate 32.3. only the 'register' function is different, should have no impact
  // @ts-expect-error
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
