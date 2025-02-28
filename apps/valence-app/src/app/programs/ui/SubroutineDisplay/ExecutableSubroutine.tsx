"use client";
import {
  Button,
  cn,
  FormRoot,
  FormSubmit,
  Heading,
  HoverCardContent,
  HoverCardRoot,
  HoverCardTrigger,
  LinkText,
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
  permissionFactoryDenom,
  useLibrarySchema,
  useQueryArgs,
} from "@/app/programs/ui";
import { useForm } from "react-hook-form";
import {
  type AtomicFunction,
  type NonAtomicFunction,
} from "@valence-ui/generated-types";
import { CelatoneUrl, QUERY_KEYS } from "@/const";
import { displayAddress, jsonToBase64, jsonToUtf8 } from "@/utils";
import { useWallet } from "@/hooks";
import { EncodeObject } from "@cosmjs/proto-signing";
import { MsgExecuteContract } from "@/smol_telescope/generated-files";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
}: {
  functions: NonAtomicFunction[] | AtomicFunction[];
  isAuthorized: boolean;
  isAtomic: boolean;
  authorizationsAddress: string;
  subroutineLabel: string;
}) => {
  const { address: walletAddress, isWalletConnected } = useWallet();
  const { queryConfig } = useQueryArgs();
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
      const extractedValues = values.messages.map((msg) => {
        return JSON.parse(msg);
      });

      const signer = await connectWithOfflineSigner({
        chainId: queryConfig.main.chainId,
        chainName: queryConfig.main.name,
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
      return result;
    },
    onError: (e) => {
      toast.error(
        <ToastMessage variant="error" title="Execution failed">
          {e.message}
        </ToastMessage>,
      );
      console.log("error", e);
    },
    onSuccess: () => {
      toast.success(
        <ToastMessage
          variant="success"
          title="Messages sent to processor"
        ></ToastMessage>,
      );
      queryClient.invalidateQueries(
        {
          refetchType: "active",
          exact: false,
          queryKey: [QUERY_KEYS.PROGRAMS_FETCH_PROGRAM],
        },
        {},
      );
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

                <LinkText
                  blankTarget={true}
                  className="font-mono text-xs"
                  variant={"secondary"}
                  href={CelatoneUrl.contract(libraryAddress)}
                >
                  {displayAddress(libraryAddress)}
                </LinkText>
              </div>

              {/* this is its own component to simplify custom error handling */}
              <FunctionMessageFormField
                fieldName={`messages.${i}`}
                form={form}
                subroutineFunction={func}
                isAuthorized={isAuthorized}
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
                      <LibraryDetails libraryAddress={libraryAddress} />
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
          <FormSubmit className="mt-4" asChild>
            <Button isLoading={isExecuting} disabled={!isExecutedEnabled}>
              Execute
            </Button>
          </FormSubmit>
        </HoverCardTrigger>
        {!isAuthorized && (
          <HoverCardContent side="right" sideOffset={10} className="w-80">
            <div>
              <Heading level="h3">Unauthorized.</Heading>
              <div className="text-sm pt-2">
                Wallet must hold the authorization token:{" "}
                <span className="font-mono text-wrap break-words text-xs">
                  {permissionFactoryDenom({
                    authorizationsAddress,
                    authorizationLabel: subroutineLabel,
                  })}
                </span>
              </div>
            </div>
          </HoverCardContent>
        )}
        {!isWalletConnected && (
          <HoverCardContent side="right" sideOffset={10} className="w-64">
            <ConnectWalletHoverContent />
          </HoverCardContent>
        )}
      </HoverCardRoot>
    </FormRoot>
  );
};
