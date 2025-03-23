"use client";
import { ProgramQueryConfig } from "@/app/programs/server";
import { CustomChainForm } from "@/app/programs/ui";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Label,
  toast,
  ToastMessage,
} from "@valence-ui/ui-components";
import { useAccount, useConnect } from "graz";
import { chains } from "chain-registry";
import { ChainInfo } from "@keplr-wallet/types";
import { useSupportedChains } from "@/context";

import { useSuggestChainAndConnect, WalletType } from "graz";

export const DomainConnector = ({
  domainName,
  chainId,
  queryConfig,
}: {
  domainName: string;
  chainId?: string;
  queryConfig: ProgramQueryConfig;
}) => {
  const { isConnected: isWalletConnected, data: accounts } = useAccount({
    multiChain: true,
  });
  const { suggestAndConnectAsync } = useSuggestChainAndConnect();

  const account = accounts && chainId ? accounts[chainId] : null;

  const isRegisterdChain = chains.find((chain) => chain.chain_id === chainId);

  const domainRpcUrl =
    domainName === queryConfig.main.domainName
      ? queryConfig.main.rpc
      : queryConfig.external?.find((chain) => chain.domainName === domainName)
          ?.rpc;

  const { connect } = useConnect();
  const [supportedChains, setSupportedChains] = useSupportedChains();

  const handleConnectCustomChain = async (chainInfo: ChainInfo) => {
    try {
      setSupportedChains([...supportedChains, chainInfo]);
      await suggestAndConnectAsync({
        chainInfo,
        walletType: WalletType.KEPLR,
      });
    } catch (e) {
      toast.error(
        <ToastMessage variant="error" title="Failed to connect">
          {e.message}
        </ToastMessage>,
      );
    }
  };

  const handleConnect = () => {
    try {
      if (!chainId) {
        throw new Error(
          `Chain ID missing for domain ${domainName}. Check RPC settings.`,
        );
      }
      connect({
        chainId,
      });
    } catch (error) {
      toast.error(
        <ToastMessage variant="error" title="Failed to connect">
          {error.message}
        </ToastMessage>,
      );
      console.log("Connect domain error", error);
    }
  };

  const Layout = ({ children }: { children?: React.ReactNode }) => {
    return (
      <>
        <div className="text-xs font-mono w-fit">{domainName}</div>
        <div className="text-xs w-fit">{children}</div>
      </>
    );
  };

  if (!isWalletConnected) {
    return <Layout />;
  } else if (account)
    return (
      <Layout>
        <Label variant="green">Connected</Label>
      </Layout>
    );
  else if (isRegisterdChain)
    return (
      <Layout>
        <Button onClick={handleConnect} size="sm" variant="secondary">
          Connect
        </Button>
      </Layout>
    );
  else
    return (
      <Layout>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="secondary">
              Connect to custom chain ({chainId})
            </Button>
          </DialogTrigger>
          <DialogContent className=" w-3/4">
            <CustomChainForm
              domainName={domainName}
              rpcUrl={domainRpcUrl}
              chainId={chainId}
              onSubmit={(input: ChainInfo) => {
                handleConnectCustomChain(input);
              }}
            />
          </DialogContent>
        </Dialog>
      </Layout>
    );
};
