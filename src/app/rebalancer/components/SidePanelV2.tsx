"use client";
import { Button, LinkText, TextInput, Label } from "@/components";
import { X_HANDLE, X_URL } from "@/const/socials";
import { useWallet } from "@/hooks";
import { cn } from "@/utils";
import Image from "next/image";
import { accountAtom } from "@/app/rebalancer/const";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { DEFAULT_ACCOUNT, scaleAtom } from "@/app/rebalancer/const";
import { useAtom } from "jotai";
import { chainConfig } from "@/const/config";
import { useValenceAccount } from "@/app/rebalancer/hooks";

export const SidePanelV2: React.FC<{
  isLoading: boolean;
}> = ({ isLoading }) => {
  const [accountUrlParam, setAccountUrlParam] = useQueryState("account", {
    defaultValue: DEFAULT_ACCOUNT,
  });
  const [account, setAccount] = useAtom(accountAtom);
  useMemo(() => {
    setAccount(accountUrlParam);
  }, [setAccount, accountUrlParam]);

  return (
    <div className="flex w-96 shrink-0 flex-col overflow-hidden overflow-y-auto border-r border-valence-black">
      <Brand account={account} setAccount={setAccountUrlParam} />
      <DiscoverPanel account={account} />
    </div>
  );
};

const Brand: React.FC<{
  account: string;
  setAccount: (s: string) => void;
}> = ({ account, setAccount }) => {
  return (
    <div className=" flex flex-col items-stretch gap-4 border-b   border-valence-black p-4">
      <div className="flex flex-row  items-center gap-4 border-valence-black">
        <Image
          className="max-h-20 w-auto"
          src="/img/rebalancer.svg"
          alt="Rebalancer illustration"
          width={134}
          height={80}
        />
        <div className="">
          <h1 className="text-xl font-bold">Rebalancer (beta)</h1>
          <p className="text-pretty pt-1">
            Automated balance sheet and treasury management. Contact{" "}
            <LinkText
              className=" text-valence-black hover:border-b-[1.6px] hover:border-valence-black"
              href={X_URL}
            >
              {X_HANDLE}
            </LinkText>{" "}
            for support.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <ConnectWalletButton />
      </div>

      <div className="flex flex-col gap-2  ">
        <h1 className="font-bold">Search by address</h1>

        <TextInput
          input={account}
          onChange={(value) => setAccount(value)}
          textClassName="font-mono"
          containerClassName="w-full"
          placeholder="neutron12345..."
        />
      </div>
    </div>
  );
};

const DiscoverPanel: React.FC<{
  account: string;
}> = ({ account }) => {
  const { address, isWalletConnected } = useWallet();
  const { data: valenceAddress } = useValenceAccount(address);
  let featuredAccounts = chainConfig.featuredAccounts;

  const router = useRouter();
  const [scale] = useAtom(scaleAtom);

  return (
    <div className="flex flex-col  items-stretch gap-2  p-4">
      <h1 className="font-bold">Discover</h1>

      <div>
        {featuredAccounts.length === 0 && (
          <p className="pt-2 text-sm">
            No featured accounts to show for {chainConfig.chain.pretty_name}.
          </p>
        )}
        {isWalletConnected && (
          <div
            key={`discover-${valenceAddress}`}
            onClick={() => {
              if (valenceAddress)
                router.push(
                  `/rebalancer?account=${valenceAddress}&scale=${scale}`,
                );
              else router.push(`/rebalancer/`);
            }}
            className={cn(
              "border-l border-r border-t border-valence-gray transition-all",

              "flex flex-col gap-0.5  bg-valence-white px-3 py-3",
              (account === valenceAddress || (!account && !valenceAddress)) &&
                "bg-valence-black text-valence-white",
              account !== valenceAddress && "hover:bg-valence-lightgray",
            )}
          >
            <div className="flex flex-row justify-between gap-2 ">
              <span className=" text-pretty">Your account</span>
            </div>
          </div>
        )}

        {featuredAccounts.map((option, i) => {
          const isLastElement = i === featuredAccounts.length - 1;

          return (
            <div
              key={`discover-${option.value}`}
              onClick={() => {
                router.push(
                  `/rebalancer?account=${option.value}&scale=${scale}`,
                );
              }}
              className={cn(
                "border-l border-r border-t border-valence-gray transition-all",
                isLastElement && "border-b",
                "flex flex-col gap-0.5  bg-valence-white px-3 py-3",
                account === option.value &&
                  "bg-valence-black text-valence-white",
                account !== option.value && "hover:bg-valence-lightgray",
              )}
            >
              <div className="flex flex-row justify-between gap-2 ">
                <span className=" text-pretty">{option.label}</span>

                <Label text="Featured" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ConnectWalletButton: React.FC = () => {
  const { isWalletConnected, isWalletConnecting, connect, address } =
    useWallet();
  const { data: valenceAccount, isLoading: isValenceAccountLoading } =
    useValenceAccount(address);

  const router = useRouter();
  useEffect(() => {
    // redirect to your own account if it exists
    if (valenceAccount && isWalletConnected)
      router.push(`/rebalancer?account=${valenceAccount}`);
  }, [router, isWalletConnected, valenceAccount]);

  if (!isWalletConnected)
    return (
      <>
        <Button
          isLoading={isWalletConnecting || isValenceAccountLoading}
          onClick={async () => {
            await connect();
          }}
          variant="primary"
        >
          {" "}
          Connect Wallet
        </Button>
        <p className="text-center text-sm">
          Connect your wallet to start rebalancing funds.
        </p>
      </>
    );
  else return null;
};
