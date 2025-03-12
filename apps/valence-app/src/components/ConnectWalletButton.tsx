"use client";
import {
  Button,
  PrettyJson,
  ToastMessage,
  cn,
  toast,
} from "@valence-ui/ui-components";
import { useAlert, useIsServer } from "@/hooks";
import * as Popover from "@radix-ui/react-popover";
import { displayAddress } from "@/utils";
import {
  useAccount,
  checkWallet,
  useConnect,
  useDisconnect,
  WalletType,
} from "graz";

export const ConnectWalletButton: React.FC<{}> = ({}) => {
  const isServer = useIsServer();

  const { connect, error: connectError } = useConnect();

  const { disconnect } = useDisconnect();
  const {
    data: account,
    isConnected: isWalletConnected,
    isConnecting: isWalletConnecting,
  } = useAccount();
  const walletAddress = account?.bech32Address;

  useAlert(!!(connectError as any), () => {
    // TODO: prevent from spamming
    toast.error(
      <ToastMessage variant="error" title="Error connecting wallet.">
        <PrettyJson data={connectError ?? {}} />
      </ToastMessage>,
    );
  });

  useAlert(!checkWallet(WalletType.KEPLR), () => {
    toast.error(
      <ToastMessage variant="error" title="Keplr is unavailable.">
        Sign in, or install the extenstion. Support for more wallets will be
        added soon.
      </ToastMessage>,
    );
  });

  if (isServer)
    return (
      <Button disabled={true} variant="primary" size="sm">
        Connect Wallet
      </Button>
    );

  if (!isWalletConnected) {
    return (
      <Button
        size="sm"
        className="hidden md:flex"
        disabled={isWalletConnecting}
        onClick={async () => {
          await connect({
            chainId: "neutron-1",
            autoReconnect: false,
            walletType: WalletType.KEPLR,
          });
        }}
        variant="primary"
      >
        {isWalletConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          size="sm"
          className={cn(
            "font-mono text-xs",
            "hidden md:flex", // hide on mobile
          )}
          variant="secondary"
        >
          {displayAddress(walletAddress ?? "")}
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
          </div>

          <div>
            <div className="max-w-48 text-balance break-words text-left font-mono text-xs">
              {walletAddress}
            </div>
          </div>
        </div>

        <Button size="sm" onClick={() => disconnect()} variant="secondary">
          Disconnect
        </Button>
      </Popover.Content>
    </Popover.Root>
  );
};
