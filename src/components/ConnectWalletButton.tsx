"use client";
import { Button } from "@/components";
import { useWallet } from "@/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useValenceAccount } from "@/app/rebalancer/hooks";

export const ConnectWalletButton: React.FC<{
  disabled: boolean;
  debouncedMouseEnter?: () => void;
  debouncedMouseLeave?: () => void;
  connectCta: string;
  rerouteOnConnect?: boolean;
}> = ({
  disabled,
  debouncedMouseEnter,
  debouncedMouseLeave,
  connectCta,
  rerouteOnConnect = false,
}) => {
  const { isWalletConnected, isWalletConnecting, connect, address } =
    useWallet();
  const { data: valenceAccount, isLoading: isValenceAccountLoading } =
    useValenceAccount(address);
  const router = useRouter();

  // for calling effect only when connect wallet is clicked
  const [connectWalletClicked, setConnectWalletClicked] = useState(false);

  // redirect to rebalancer page after wallet is connected and data is fetched
  useEffect(() => {
    if (!rerouteOnConnect) return;
    if (!connectWalletClicked) return;
    if (isValenceAccountLoading) return;
    if (valenceAccount) {
      router.push(`/rebalancer?account=${valenceAccount}`);
    } else router.push(`/rebalancer/`);
  }, [
    rerouteOnConnect,
    connectWalletClicked,
    address,
    valenceAccount,
    isValenceAccountLoading,
  ]);

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
