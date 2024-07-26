"use client";
import { ChainProvider } from "@cosmos-kit/react-lite";

import { wallets } from "@cosmos-kit/keplr";
import { ReactNode } from "react";
import { chainConfig } from "@/const/config";
import { WalletModalProps } from "@cosmos-kit/core";

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
