"use client";
import { UseFormReturn } from "react-hook-form";
import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import {
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
  InfoText,
  LoadingSkeleton,
} from "@valence-ui/ui-components";
import {
  decodeInstatiateMessage,
  decodeRegisterMessage,
  makeCreateRebalancerMessages,
} from "@/app/rebalancer/ui";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import { useWallet } from "@/hooks";
import { useEffect, useMemo } from "react";
import { ErrorHandler } from "@/const/error";

export const PreviewMessage: React.FC<{
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
  address: string;
}> = ({ form, address }) => {
  const { watch } = form;
  const { getCosmWasmClient } = useWallet();

  const cwClient = useMemo(() => {
    try {
      return getCosmWasmClient();
    } catch (e) {
      ErrorHandler.makeError("Failed to make CosmWasm client", e);
      return null;
    }
  }, [getCosmWasmClient]);

  const values = watch();
  const {
    data: previewData,
    isLoading,
    isError,
    error,
  } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [QUERY_KEYS.REBALANCER_FORM_MESSAGE_PREVIEW, address, values],
    enabled: !!cwClient,

    queryFn: async () => {
      const client = await cwClient;
      if (!client)
        throw ErrorHandler.makeError("CosmWasm client not available");
      const { valenceAddress, messages } = await makeCreateRebalancerMessages({
        config: values,
        creatorAddress: address,
        cosmwasmClient: client,
      });
      const decodedInstatiateMessage = decodeInstatiateMessage(messages[0]);
      const decodedRegisterMessage = decodeRegisterMessage(messages[1]);
      const body = [decodedInstatiateMessage, decodedRegisterMessage];

      return {
        decodedMessages: JSON.stringify(body, replacer, 2),
        valenceAddress: valenceAddress,
      };
    },
  });

  useEffect(() => {
    if (!!error) console.log("Error loading preview", error);
  }, [error]);
  return (
    <CollapsibleSectionRoot variant="secondary" defaultIsOpen={false}>
      <CollapsibleSectionHeader>
        <span className="text-lg font-bold">Preview transaction</span>
      </CollapsibleSectionHeader>
      <CollapsibleSectionContent>
        <div className="flex w-full flex-col gap-6">
          <p className="text-sm">
            The following messages will be sent to your wallet for signing.
          </p>
          {isLoading && <LoadingSkeleton className="min-h-24" />}
          {isError && (
            <InfoText variant="error">Error loading preview.</InfoText>
          )}
          {previewData && (
            <pre className="whitespace-pre-wrap text-xs">
              {previewData?.decodedMessages}
            </pre>
          )}
        </div>
      </CollapsibleSectionContent>
    </CollapsibleSectionRoot>
  );
};

const replacer = (key: string, value: any) => {
  return typeof value === "bigint" ? value.toString() : value;
};
