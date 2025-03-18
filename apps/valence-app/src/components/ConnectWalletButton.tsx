"use client";
import {
  Button,
  Heading,
  PrettyJson,
  ToastMessage,
  cn,
  toast,
} from "@valence-ui/ui-components";
import { useAlert, useIsServer } from "@/hooks";
import * as Popover from "@radix-ui/react-popover";
import {
  useAccount,
  checkWallet,
  useConnect,
  useDisconnect,
  WalletType,
} from "graz";
import { chains } from "chain-registry";

export const ConnectWalletButton: React.FC<{}> = ({}) => {
  const isServer = useIsServer();

  const { connect, error: connectError } = useConnect();

  const { disconnect } = useDisconnect();
  const {
    data: accounts,
    isConnected: isWalletConnected,
    isConnecting: isWalletConnecting,
  } = useAccount({
    multiChain: true,
  });

  useAlert(!!(connectError as any), () => {
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
          className={cn(
            "hidden md:flex", // hide on mobile
          )}
          variant="secondary"
        >
          Wallet
        </Button>
      </Popover.Trigger>

      <Popover.Content
        side="bottom"
        sideOffset={11}
        className="items-left z-50 flex flex-col gap-4 border border-valence-black bg-valence-white p-4 shadow-md transition-all mr-4"
      >
        <div className="items-left flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Heading level="h3">Connected chains</Heading>
            {Object.values(accounts ?? {}).length > 0 && (
              <Button
                onClick={() => disconnect()}
                size="sm"
                variant="secondary"
              >
                Disconnect all
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {Object.entries(accounts ?? {}).map(([chainId, account]) => {
              const chainName = chains.find(
                (c) => c.chain_id === chainId,
              )?.chain_name;

              return (
                <div
                  key={`wallet-connection-${chainId}`}
                  className="flex flex-col gap-1"
                >
                  {chainName && (
                    <div className="text-xs font-semibold">{chainName}</div>
                  )}
                  <div className="max-w-48 text-balance break-words text-left font-mono text-xs">
                    {account?.bech32Address}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => disconnect({ chainId })}
                    variant="secondary"
                  >
                    Disconnect
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};
