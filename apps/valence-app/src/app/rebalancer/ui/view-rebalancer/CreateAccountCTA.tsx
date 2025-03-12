"use client";
import { Asset, Heading } from "@valence-ui/ui-components";
import { SymbolColors, useAssetMetadata } from "@/app/rebalancer/ui";
import { displayNumberV2, microToBase } from "@/utils";
import { useWalletBalances } from "@/hooks";
import { useRouter } from "next/navigation";
import { chainConfig } from "@/const/config";
import { StatusBar } from "@/components/StatusBar";
import { useAccount } from "graz";
export const CreateAccountCTA = () => {
  const { data: connectedAccount, isConnected: isWalletConnected } =
    useAccount();
  const walletAddress = connectedAccount?.bech32Address;
  // only to handle loading state when wallet is connected
  const router = useRouter();
  const {
    isLoading: isBalancesLoading,
    data: walletBalances, // will be loaded at this stage
  } = useWalletBalances(walletAddress, {
    refetchInveral: 10 * 1000,
  });

  const getOriginAsset = useAssetMetadata().getOriginAsset;

  if (isBalancesLoading) return <StatusBar variant="loading" />;

  const allButOneAsset = chainConfig.supportedRebalancerAssets.slice(0, -1);
  const lastAsset = chainConfig.supportedRebalancerAssets.slice(-1)[0];

  const assetList =
    allButOneAsset.map((a) => a.symbol).join(", ") + " and " + lastAsset.symbol;

  return (
    <div className="justify-left flex max-w-[640px] flex-col gap-4 border border-black bg-white p-8">
      <Heading level="h2"> No accounts associated with this wallet</Heading>

      <p className="text-sm">
        The Rebalancer currently supports {assetList}, with more assets coming
        soon.
      </p>
      {!!walletBalances?.length && (
        <div className="flex flex-col gap-2">
          <p>
            The below supported assets were detected in your Neutron wallet:
          </p>
          {walletBalances?.map((balance) => {
            const assetMetadata = getOriginAsset(balance.denom);
            const symbol = assetMetadata?.symbol;
            const amount = microToBase(
              balance.amount,
              assetMetadata?.decimals ?? 6,
            );
            return (
              <div key={`cta-balance-${balance.denom}`} className="flex gap-2">
                <Asset
                  color={SymbolColors.get(symbol ?? "")}
                  symbol={symbol ?? ""}
                />{" "}
                <span className="font-mono">
                  {displayNumberV2(amount, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => router.push("/rebalancer/create")}
        className="w-fit bg-valence-black px-4 py-2 text-h3 text-white"
      >
        Start rebalancing funds
      </button>
    </div>
  );
};
