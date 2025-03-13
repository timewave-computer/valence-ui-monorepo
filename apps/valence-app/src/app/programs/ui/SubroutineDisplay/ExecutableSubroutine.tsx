"use client";
import {
  Button,
  cn,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
  Copyable,
  FormRoot,
  FormSubmit,
  Heading,
  HoverCardContent,
  HoverCardRoot,
  HoverCardTrigger,
  InfoText,
  InputLabel,
  LinkText,
  PrettyJson,
  Sheet,
  SheetContent,
  SheetTrigger,
  toast,
  ToastMessage,
} from "@valence-ui/ui-components";
import {
  ConnectWalletHoverContent,
  connectWithOfflineSigner,
  displayLibraryContractName,
  FunctionMessageFormField,
  generateMessageBody,
  getFunctionLibraryAddress,
  jsonToIndentedText,
  LibraryDetails,
  useLibrarySchema,
  useProgramQuery,
} from "@/app/programs/ui";
import { useForm } from "react-hook-form";
import {
  type AtomicFunction,
  type NonAtomicFunction,
} from "@valence-ui/generated-types";
import { QUERY_KEYS } from "@/const";
import { displayAddress, jsonToBase64, jsonToUtf8 } from "@/utils";
import { EncodeObject } from "@cosmjs/proto-signing";
import { MsgExecuteContract } from "@/smol_telescope/generated-files";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Coin } from "@cosmjs/stargate";
import { type QueryConfig } from "@/app/programs/server";
import { useAccount, useOfflineSigners } from "graz";

export interface SubroutineMessageFormValues {
  messages: string[];
}

/**
 * This is itws own component because each subroutine should have its own useForm instantiatio
 */
export const ExecutableSubroutine = ({
  functions,
  isAuthorized,
  isAtomic,
  authorizationsAddress,
  subroutineLabel,
  authTokenBalance,
  executionLimit,
  authTokenDenom,
  programId,
  queryConfig,
  chainIds,
}: {
  functions: NonAtomicFunction[] | AtomicFunction[];
  isAuthorized: boolean;
  isAtomic: boolean;
  authorizationsAddress: string;
  subroutineLabel: string;
  authTokenBalance: Coin | undefined;
  executionLimit: string | null;
  authTokenDenom: string | null;
  programId: string;
  queryConfig: QueryConfig;
  chainIds: string;
}) => {
  // TODO: revisit using this pattern vs passing as props. I didnt feel like props drilling all the way here. Not critical if loading state not handled.
  const { data: program } = useProgramQuery({ programId });
  const mainChainId = queryConfig.main.chainId;
  const { data: account, isConnected: isWalletConnected } = useAccount({
    chainId: mainChainId,
  });

  const { data: offlineSigners } = useOfflineSigners({
    chainId: chainIds,
    multiChain: true,
  });
  const mainChainSigner =
    offlineSigners && mainChainId in offlineSigners
      ? offlineSigners[mainChainId]
      : null;
  const walletAddress = account?.bech32Address;

  const queryClient = useQueryClient();

  const form = useForm<SubroutineMessageFormValues>({
    defaultValues: {
      messages: functions.map((subroutineFunction) => {
        return jsonToIndentedText(
          generateMessageBody(subroutineFunction.message_details),
        );
      }),
    },
  });

  const { mutate: handleExecute, isPending: isExecuting } = useMutation({
    mutationFn: async ({
      values,
      subroutineLabel,
    }: {
      values: SubroutineMessageFormValues;
      subroutineLabel: string;
    }) => {
      if (!mainChainSigner) {
        throw new Error(
          `No offline signer available for ${mainChainId}. Try reconnecting wallet.`,
        );
      }
      const extractedValues = values.messages.map((msg) => {
        return JSON.parse(msg);
      });

      const signer = await connectWithOfflineSigner({
        offlineSigner: mainChainSigner.offlineSigner,
        chainId: queryConfig.main.chainId,
        rpcUrl: queryConfig.main.rpcUrl,
      });

      const cwMessageBodies = extractedValues.map((msg) => {
        return {
          cosmwasm_execute_msg: {
            msg: jsonToBase64(msg),
          },
        };
      });

      const messages: EncodeObject[] = [
        {
          typeUrl: MsgExecuteContract.typeUrl,
          value: {
            funds: executionLimit
              ? [
                  {
                    denom: authTokenDenom,
                    amount: "1",
                  },
                ]
              : undefined,
            sender: walletAddress,
            contract: authorizationsAddress,
            msg: jsonToUtf8({
              permissionless_action: {
                send_msgs: {
                  label: subroutineLabel,
                  messages: cwMessageBodies,
                },
              },
            }),
          },
        },
      ];

      const result = await signer.signAndBroadcast(
        walletAddress ?? "",
        messages,
        "auto",
      );

      if (result.code !== 0) {
        throw new Error(result.rawLog);
      }
      return result;
    },
    onError: (e) => {
      toast.error(
        <ToastMessage variant="error" title="Execution failed">
          {e.message}
        </ToastMessage>,
      );
      console.log(e);
    },
    onSuccess: () => {
      toast.success(
        <ToastMessage
          variant="success"
          title="Sent to processor"
        ></ToastMessage>,
      );
      queryClient.invalidateQueries({
        refetchType: "active",
        exact: false,
        queryKey: [QUERY_KEYS.PROGRAMS_FETCH_PROGRAM],
      });
      queryClient.invalidateQueries({
        refetchType: "active",
        exact: false,
        queryKey: [QUERY_KEYS.WALLET_BALANCES_V2],
      });
    },
  });

  const isExecutedEnabled = isWalletConnected && isAuthorized && !isExecuting;

  const { getValues, resetField } = form;
  const { getLibrarySchema } = useLibrarySchema();

  return (
    <FormRoot
      onSubmit={(e) => {
        e.preventDefault();
        const vals = getValues();
        return handleExecute({
          values: vals,
          subroutineLabel: subroutineLabel,
        });
      }}
    >
      <div
        className={cn(
          "flex flex-col gap-8",
          isAtomic && "border-l-4 border-graph-teal pl-4",
        )}
      >
        {functions?.map((func, i) => {
          const libraryAddress = getFunctionLibraryAddress(func);
          const librarySchema = getLibrarySchema(libraryAddress);

          const authorization = Object.values(
            program?.parsedProgram?.libraries ?? {},
          ).find((lib) => lib.addr === libraryAddress);
          const libraryChainId = authorization?.chainId ?? ""; // TODO handle this more nicely
          const libraryConfig =
            program?.libraryConfigs && libraryAddress in program?.libraryConfigs
              ? program?.libraryConfigs[libraryAddress]
              : null;
          return (
            <div
              className={cn(
                i === 0 && functions.length > 1 && "border-b-0",
                !isAtomic && "border-l-4 border-graph-purple pl-4",
              )}
              key={`functionfield-${func.contract_address}-${i}`}
            >
              <div className="flex flex-row gap-1 items-center">
                <Heading level="h4">
                  {displayLibraryContractName(
                    librarySchema?.raw?.contract_name,
                  )}
                </Heading>
                <Copyable copyText={libraryAddress}>
                  <LinkText
                    LinkComponent={"div"}
                    className="font-mono text-xs"
                    variant={"secondary"}
                  >
                    {displayAddress(libraryAddress)}
                  </LinkText>
                </Copyable>
              </div>
              {libraryConfig && (
                <CollapsibleSectionRoot defaultIsOpen={false} className="pb-2">
                  <CollapsibleSectionHeader buttonClassname="h-3 w-3">
                    <InputLabel noGap label="Config" size="sm" />
                  </CollapsibleSectionHeader>
                  <CollapsibleSectionContent>
                    <PrettyJson data={libraryConfig} />
                  </CollapsibleSectionContent>
                </CollapsibleSectionRoot>
              )}

              {/* this is its own component to simplify custom error handling */}
              <FunctionMessageFormField
                fieldName={`messages.${i}`}
                form={form}
                subroutineFunction={func}
              />
              <div className="flex flex-row gap-2 items-center pt-2">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    resetField(`messages.${i}`);
                  }}
                  size="sm"
                  variant="secondary"
                >
                  Reset body
                </Button>

                {librarySchema && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="sm" variant="secondary">
                        View details
                      </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-3/4">
                      <LibraryDetails
                        libraryChainId={libraryChainId}
                        libraryAddress={libraryAddress}
                      />
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <HoverCardRoot>
        <HoverCardTrigger asChild>
          <div className="flex flex-row gap-2 items-center mt-4 w-fit">
            <FormSubmit asChild>
              <Button isLoading={isExecuting} disabled={!isExecutedEnabled}>
                Execute
              </Button>
            </FormSubmit>
            {isAuthorized && executionLimit && (
              <InfoText>
                {authTokenBalance?.amount} executions remaining
              </InfoText>
            )}
          </div>
        </HoverCardTrigger>
        {!isWalletConnected && (
          <HoverCardContent side="right" sideOffset={10} className="w-64">
            <ConnectWalletHoverContent />
          </HoverCardContent>
        )}
        {isWalletConnected && !isAuthorized && (
          <HoverCardContent side="right" sideOffset={10} className="w-80">
            <div>
              <Heading level="h3">Unauthorized.</Heading>
              <div className="text-sm pt-2">
                Wallet must hold the authorization token:{" "}
                <span className="font-mono text-wrap break-words text-xs">
                  {authTokenDenom}
                </span>
              </div>
            </div>
          </HoverCardContent>
        )}
      </HoverCardRoot>
    </FormRoot>
  );
};
