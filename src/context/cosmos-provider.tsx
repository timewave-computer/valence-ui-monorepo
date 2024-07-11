"use client";
import { assets } from "chain-registry";
import { ChainProvider } from "@cosmos-kit/react-lite";

import { wallets } from "@cosmos-kit/keplr";
import { ReactNode } from "react";
import { NEUTRON_CHAIN } from "@/const/neutron";
import { WalletModalProps } from "@cosmos-kit/core";

const ENABLED_WALLETS = [wallets[0]]; // only keplr web, not mobile
const ENABLED_ASSETS = assets.filter(
  (a) => a.chain_name === NEUTRON_CHAIN.chain_name,
);
export const CosmosProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <ChainProvider
      walletModal={WalletModal} // temporarily is a no-op
      chains={[NEUTRON_CHAIN]}
      assetLists={ENABLED_ASSETS}
      wallets={ENABLED_WALLETS}
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
