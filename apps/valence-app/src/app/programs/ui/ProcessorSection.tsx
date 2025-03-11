import {
  Button,
  CellType,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
  Heading,
  HoverCardContent,
  HoverCardRoot,
  HoverCardTrigger,
  LinkText,
  PrettyJson,
  Table,
  toast,
  ToastMessage,
  type TableColumnHeader,
} from "@valence-ui/ui-components";
import { type FetchProcessorQueuesReturnType } from "@/app/programs/server";
import { BsClockFill } from "react-icons/bs";
import { displayAddress, jsonToUtf8 } from "@/utils";
import { CelatoneUrl, QUERY_KEYS } from "@/const";
import {
  ConnectWalletHoverContent,
  connectWithOfflineSigner,
  useQueryArgs,
} from "@/app/programs/ui";
import { useWallet } from "@/hooks";
import { EncodeObject } from "@cosmjs/proto-signing";
import { MsgExecuteContract } from "@/smol_telescope/generated-files";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const ProcessorSection = ({
  processorData,
  processorAddress,
  domain,
}: {
  processorData?: FetchProcessorQueuesReturnType[number];
  processorAddress: string;
  domain?: string;
}) => {
  const { isWalletConnected, address: walletAddress } = useWallet();
  const { queryConfig } = useQueryArgs();
  const queryClient = useQueryClient();
  console.log("processor data", processorData);

  const { mutate: handleTick, isPending: isTickPending } = useMutation({
    mutationFn: async () => {
      const signer = await connectWithOfflineSigner({
        chainId: queryConfig.main.chainId,
        chainName: queryConfig.main.name,
        rpcUrl: queryConfig.main.rpcUrl,
      });

      const messages: EncodeObject[] = [
        {
          typeUrl: MsgExecuteContract.typeUrl,
          value: {
            sender: walletAddress,
            contract: processorAddress,
            msg: jsonToUtf8({
              permissionless_action: {
                tick: {},
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
        <ToastMessage variant="error" title="Tick failed">
          {e.message}
        </ToastMessage>,
      );
      console.log("error", e);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries(
        {
          refetchType: "active",
          exact: false,
          queryKey: [QUERY_KEYS.PROGRAMS_FETCH_PROGRAM],
        },
        {},
      );
      queryClient.invalidateQueries({
        refetchType: "active",
        exact: false,
        queryKey: [QUERY_KEYS.WALLET_BALANCES_V2],
      });
      toast.success(
        <ToastMessage variant="success" title="Tick successful">
          Subroutine will be executed by the authorizations contract.
        </ToastMessage>,
      );
    },
  });

  const queue = processorData?.queue;

  const data =
    queue?.map((messageBatch) => {
      const { id, priority, retry, msgs, subroutine } = messageBatch;

      return {
        [ProcessorTableKeys.executionId]: { value: id.toString() },
        [ProcessorTableKeys.priority]: {
          value: priority,
          color:
            priority === "high"
              ? "red"
              : priority === "medium"
                ? "yellow"
                : "gray",
        },
        [ProcessorTableKeys.retryCounts]: {
          value: retry?.retry_amounts.toString() ?? "-",
        },
        [ProcessorTableKeys.retryCooldown]: {
          value: JSON.stringify(retry?.retry_cooldown),
        },
        [ProcessorTableKeys.messages]: {
          link: "View",
          body: (
            <>
              <Heading level="h2">Messages</Heading>
              <PrettyJson data={msgs} />
            </>
          ),
        },
        [ProcessorTableKeys.subroutine]: {
          link: "View",
          body: (
            <>
              <Heading level="h2">Subroutine</Heading>
              <PrettyJson data={subroutine} />
            </>
          ),
        },
      };
    }) ?? [];

  return (
    <CollapsibleSectionRoot
      defaultIsOpen={true}
      className=""
      key={`processor-${processorAddress}`}
    >
      <CollapsibleSectionHeader className="flex flex-row items-center gap-2 w-full  justify-between p-4 pb-0">
        <div className="flex flex-row gap-2 items-center">
          <HoverCardRoot>
            <HoverCardTrigger asChild>
              <Button
                disabled={!isWalletConnected || isTickPending}
                isLoading={isTickPending}
                PrefixIcon={BsClockFill}
                variant="secondary"
                onClick={(e) => {
                  // prevent the parent collapsible section from toggling
                  e.stopPropagation();
                  handleTick();
                }}
              >
                Tick
              </Button>
            </HoverCardTrigger>
            {!isWalletConnected && (
              <HoverCardContent side="right" sideOffset={10} className="w-64">
                <ConnectWalletHoverContent />
              </HoverCardContent>
            )}
          </HoverCardRoot>

          <div className="flex flex-col  items-start">
            <Heading level="h3">{processorData?.chainName ?? domain}</Heading>
            <LinkText
              blankTarget
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={CelatoneUrl.contract(processorAddress)}
              className="font-mono text-xs"
            >
              {displayAddress(processorAddress)}
            </LinkText>
          </div>
        </div>
      </CollapsibleSectionHeader>
      <CollapsibleSectionContent>
        {!queue ? (
          <p>Queue not found</p>
        ) : (
          <Table
            className="p-2"
            variant="secondary"
            headers={headers}
            data={data}
          />
        )}
      </CollapsibleSectionContent>
    </CollapsibleSectionRoot>
  );
};

enum ProcessorTableKeys {
  executionId = "executionId",
  priority = "priority",
  retryCounts = "retryCounts",
  retryCooldown = "retryCooldown",
  messages = "messages",
  subroutine = "subroutine",
}

const headers: TableColumnHeader[] = [
  {
    key: ProcessorTableKeys.executionId,
    label: "Execution ID",
    cellType: CellType.Text,
    align: "left",
  },
  {
    key: ProcessorTableKeys.priority,
    label: "Priority",
    cellType: CellType.Label,
  },
  {
    key: ProcessorTableKeys.retryCounts,
    label: "Retry Counts",
    cellType: CellType.Text,
  },
  {
    key: ProcessorTableKeys.retryCooldown,
    label: "Retry Cooldown",
    cellType: CellType.Text,
  },
  {
    key: ProcessorTableKeys.messages,
    label: "Messages",
    cellType: CellType.Sheet,
  },
  {
    key: ProcessorTableKeys.subroutine,
    label: "Subroutine",
    cellType: CellType.Sheet,
  },
];
