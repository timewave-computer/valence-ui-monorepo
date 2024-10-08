"use client";
import { Button, ToastMessage } from "@/components";
import { useIsServer, useWallet } from "@/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useFetchValenceAccount,
  useValenceAccount,
} from "@/app/rebalancer/hooks";
import { WalletStatus } from "@cosmos-kit/core";
import { toast } from "sonner";

export const ConnectWalletButton: React.FC<{
  disabled?: boolean;
  debouncedMouseEnter?: () => void;
  debouncedMouseLeave?: () => void;
  connectCta: string;
  rerouteOnConnect?: boolean;
}> = ({
  disabled = false,
  debouncedMouseEnter,
  debouncedMouseLeave,
  connectCta,
  rerouteOnConnect = false,
}) => {
  const isServer = useIsServer();
  const {
    isWalletConnected,
    isWalletConnecting,
    connect,
    address,
    walletStatus,
  } = useWallet();
  const { data: valenceAccount, isLoading: isValenceAccountLoading } =
    useValenceAccount(address);
  const router = useRouter();

  const { fetchValenceAccount } = useFetchValenceAccount();

  // for calling effect only when connect wallet is clicked
  const [connectWalletClicked, setConnectWalletClicked] = useState(false);
  const [isInstallKeplrAlertSeen, setIsInstallKeplrAlertSeen] = useState(false);

  useEffect(() => {
    if (walletStatus === WalletStatus.NotExist && !isInstallKeplrAlertSeen) {
      setIsInstallKeplrAlertSeen(true);
      toast.error(
        <ToastMessage variant="error" title="Please install keplr.">
          Support for more wallets will be added soon.
        </ToastMessage>,
      );
      return;
    } else if (
      walletStatus === WalletStatus.Error ||
      walletStatus === WalletStatus.Rejected
    ) {
      toast.error(
        <ToastMessage variant="error" title="Error connecting wallet.">
          Please try again.
        </ToastMessage>,
      );
    }
  }, [walletStatus, isInstallKeplrAlertSeen]);

  const [isExecutedOnce, setIsExecutedOnce] = useState(false);

  // redirect to rebalancer page after wallet is connected and data is fetched
  useEffect(() => {
    if (isExecutedOnce) return;
    if (!rerouteOnConnect) return;
    if (!connectWalletClicked) return;

    (async () => {
      const account = await fetchValenceAccount(address ?? "");
      if (account) {
        router.push(`/rebalancer?account=${account}`);
      } else router.push(`/rebalancer/`);
      setIsExecutedOnce(true);
    })();
  }, [
    fetchValenceAccount,
    rerouteOnConnect,
    connectWalletClicked,
    address,
    router,
    isExecutedOnce,
    setIsExecutedOnce,
  ]);

  if (isServer)
    return (
      <Button disabled={true} variant="primary">
        Connect Wallet
      </Button>
    );

  const button = disabled ? (
    <Button disabled={true} variant="primary">
      Connect Wallet
    </Button>
  ) : (
    <Button
      isLoading={isWalletConnecting || isValenceAccountLoading}
      onClick={async () => {
        if (disabled) return;
        await connect();
        setConnectWalletClicked(true);
      }}
      variant="primary"
    >
      {" "}
      Connect Wallet
    </Button>
  );

  if (!isWalletConnected)
    return (
      <div
        onMouseMove={debouncedMouseEnter}
        onMouseEnter={debouncedMouseEnter}
        onMouseLeave={debouncedMouseLeave}
        className="flex flex-col gap-2"
      >
        {button}
        <p className="text-center text-sm">{connectCta}</p>
      </div>
    );
  else return null;
};
