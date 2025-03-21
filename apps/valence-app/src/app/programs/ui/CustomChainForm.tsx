"use client";

import {
  Button,
  FormField,
  FormRoot,
  FormSubmit,
  Heading,
  InfoText,
  TextAreaInput,
  toast,
  ToastMessage,
} from "@valence-ui/ui-components";
import { ChainInfo } from "@keplr-wallet/types";
import { supportedProgramsChains } from "@/context";
import { useForm } from "react-hook-form";
import { neutron as neutronChainInfo } from "graz/chains";
import { checkWallet, WalletType } from "graz";

export type CustomChainFormValues = {
  suggestedChainInfo: string;
};

export const CustomChainForm = ({
  domainName,
  rpcUrl,
  chainId,
  onSubmit,
}: {
  domainName: string;
  rpcUrl?: string;
  chainId?: string;
  onSubmit: (chainInfo: ChainInfo) => void;
}) => {
  const suggestedChainInfo =
    supportedProgramsChains.find((chain) => chain.chainName === domainName) ??
    neutronChainInfo;
  const {
    currencies,
    feeCurrencies,
    rpc: suggestedRpc,
    chainId: suggestedChainId,
    rest: suggestedRest,
    chainName: _chainName, // this will be left out
    ...restOfChainInfo
  } = suggestedChainInfo;

  const placeholderChainInfo: Omit<ChainInfo, "chainName"> = {
    chainId: chainId ?? suggestedChainId,
    rpc: rpcUrl ?? suggestedRpc,
    rest: rpcUrl ?? suggestedRest,
    ...restOfChainInfo,
    feeCurrencies: [feeCurrencies[0]], // explicity set so they are at the bottom
    currencies: [currencies[0]],
  };

  const { register, handleSubmit, getValues } = useForm<CustomChainFormValues>({
    defaultValues: {
      suggestedChainInfo: JSON.stringify(placeholderChainInfo, null, 1),
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Heading level="h2">Connect Custom Chain</Heading>
      <FormRoot
        onSubmit={(e) => {
          e.preventDefault();
          const values = getValues();

          try {
            const parsed = JSON.parse(values.suggestedChainInfo);
            const parsedWithChainName = {
              ...parsed,
              chainName: domainName,
            };
            onSubmit(parsedWithChainName as ChainInfo);
          } catch (e) {
            toast.error(
              <ToastMessage variant="error" title="Failed to parse chain info">
                {e.message}
              </ToastMessage>,
            );
          }
        }}
        name="suggestedChain"
        className="flex flex-col gap-2"
      >
        <p>
          This chain info will be suggested to your wallet. Rest endpoint is not
          required to be accurate, unless you would like the wallet to read
          balances.
        </p>
        <InfoText variant="info">
          Chain name will be defaulted to the domain name.
        </InfoText>
        <FormField name="suggestedChainInfo">
          <TextAreaInput
            className="text-xs"
            {...register("suggestedChainInfo")}
            placeholder="Enter chain info"
            rows={30}
          />
        </FormField>
        <FormSubmit asChild>
          <div className="flex flex-row gap-2 items-center">
            <Button disabled={!checkWallet(WalletType.KEPLR)}>
              Suggest Chain
            </Button>
            {!checkWallet(WalletType.KEPLR) && (
              <InfoText variant="error">
                Suggesting a chain only supported with Keplr.
              </InfoText>
            )}
          </div>
        </FormSubmit>
      </FormRoot>
    </div>
  );
};
