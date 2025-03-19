import {
  Button,
  CellType,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
  Copyable,
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
import {
  NormalizedProcessorInfo,
  type ProgramQueryConfig,
  type FetchProcessorQueuesReturnType,
} from "@/app/programs/server";
import { BsClockFill } from "react-icons/bs";
import { displayAddress, jsonToUtf8 } from "@/utils";
import { QUERY_KEYS } from "@/const";
import {
  ConnectWalletHoverContent,
  connectWithOfflineSigner,
} from "@/app/programs/ui";
import { EncodeObject } from "@cosmjs/proto-signing";
import { MsgExecuteContract } from "@/smol_telescope/generated-files";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useOfflineSigners } from "graz";

export const ProcessorSection = ({
  processorQueue,
  processorData,

  queryConfig,
}: {
  processorQueue?: FetchProcessorQueuesReturnType[number];
  processorData: NormalizedProcessorInfo;

  queryConfig: ProgramQueryConfig;
}) => {
  const processorChainId = processorData.chainId;
  const processorDomain = processorData.domainName;

  const { data: account, isConnected: isWalletConnected } = useAccount({
    chainId: processorChainId,
  });
  const { data: offlineSigner } = useOfflineSigners({
    chainId: processorChainId,
  });

  const queryClient = useQueryClient();

  const { mutate: handleTick, isPending: isTickPending } = useMutation({
    mutationFn: async () => {
      const rpcUrl =
        processorDomain === queryConfig.main.domainName
          ? queryConfig.main.rpc
          : queryConfig.external?.find(
              (chain) => chain.domainName === processorDomain,
            )?.rpc;

      if (!rpcUrl) {
        throw new Error(
          `No RPC URL configured for domain ${processorData.domainName}`,
        );
      }

      const signer = await connectWithOfflineSigner({
        offlineSigner: offlineSigner?.offlineSigner,
        chainId: processorChainId,
        chainName: queryConfig.main.chainName,
        rpcUrl,
      });

      // must come after 'connect with offline signer' so chain can be added if its not already
      const signerAddress = account?.bech32Address ?? undefined;

      if (!signerAddress) {
        throw new Error(
          `Signer address for ${queryConfig.main.domainName} (chain ID ${processorChainId}) not found. Check that chain is connected to wallet.`,
        );
      }

      const messages: EncodeObject[] = [
        {
          typeUrl: MsgExecuteContract.typeUrl,
          value: {
            sender: signerAddress,
            contract: processorData.address,
            msg: jsonToUtf8({
              permissionless_action: {
                tick: {},
              },
            }),
          },
        },
      ];

      const result = await signer.signAndBroadcastSync(
        signerAddress ?? "",
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
      console.log(e);
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

  const queue = processorQueue?.queue;

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
      key={`processor-${processorData.address}`}
    >
      <CollapsibleSectionHeader className="flex flex-row items-center gap-2 w-full  justify-between p-4 pb-2">
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
                Tick to execute
              </Button>
            </HoverCardTrigger>
            {!isWalletConnected && (
              <HoverCardContent side="right" sideOffset={10} className="w-64">
                <ConnectWalletHoverContent />
              </HoverCardContent>
            )}
          </HoverCardRoot>

          <div className="flex flex-col  items-start">
            <Heading level="h3">{processorDomain}</Heading>
            <Copyable copyText={processorData.address}>
              <LinkText
                LinkComponent={"div"}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="font-mono text-xs"
              >
                {displayAddress(processorData.address)}
              </LinkText>
            </Copyable>
          </div>
        </div>
      </CollapsibleSectionHeader>
      <CollapsibleSectionContent>
        {!queue ? (
          <p className="px-4 pb-2">Queue not found</p>
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
