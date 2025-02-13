"use client";
import {
  Button,
  Label,
  ToastMessage,
  cn,
  toast,
} from "@valence-ui/ui-components";
import { useAlert, useChainContext, useIsServer, useWallet } from "@/hooks";
import * as Popover from "@radix-ui/react-popover";
import { WalletStatus } from "@cosmos-kit/core";
import { displayAddress } from "@/utils";

export const ConnectWalletButton: React.FC<{}> = ({}) => {
  const isServer = useIsServer();
  const {
    isWalletConnected,
    isWalletConnecting,
    connect,
    address,
    walletStatus,
    walletInfo,
    disconnect,
  } = useWallet();

  const { chain } = useChainContext();

  useAlert(
    walletStatus === WalletStatus.Error ||
      walletStatus === WalletStatus.Rejected,
    () => {
      // TODO: prevent from spamming
      toast.error(
        <ToastMessage variant="error" title="Error connecting wallet.">
          Please try again.
        </ToastMessage>,
      );
    },
  );

  useAlert(walletStatus === WalletStatus.NotExist, () => {
    toast.error(
      <ToastMessage variant="error" title="Please install keplr.">
        Support for more wallets will be added soon.
      </ToastMessage>,
    );
  });

  if (isServer)
    return (
      <Button disabled={true} variant="primary">
        Connect Wallet
      </Button>
    );

  if (!isWalletConnected) {
    return (
      <Button
        className="hidden md:flex"
        disabled={isWalletConnecting}
        onClick={async () => {
          await connect();
        }}
        variant="primary"
      >
        {isWalletConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button
          className={cn(
            "font-mono text-xs py-1 min-h-0",
            "hidden md:flex", // hide on mobile
          )}
          variant="secondary"
        >
          {displayAddress(address ?? "")}
        </Button>
      </Popover.Trigger>

      <Popover.Content
        side="bottom"
        sideOffset={11}
        className="items-left z-50 flex flex-col gap-4 border border-valence-black bg-valence-white p-4 shadow-md transition-all mr-4"
      >
        <div className="items-left flex flex-col gap-3">
          <div className="flex flex-row justify-between items-start">
            <h1 className="text-base font-semibold">Wallet connected</h1>

            <div
              className="h-6 w-6 bg-contain bg-center bg-no-repeat "
              style={{
                backgroundImage: `url(${walletInfo?.logo})`,
              }}
            />
          </div>

          <div>
            <Label> {chain.pretty_name}</Label>
            <div className="max-w-48 text-balance break-words text-left font-mono text-xs">
              {address}
            </div>
          </div>
        </div>

        <Button onClick={() => disconnect()} variant="secondary">
          Disconnect
        </Button>
      </Popover.Content>
    </Popover.Root>
  );
};
