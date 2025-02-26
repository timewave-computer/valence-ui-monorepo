import {
  Button,
  Card,
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
  type TableColumnHeader,
} from "@valence-ui/ui-components";
import { GetProgramDataReturnValue } from "@/app/programs/server";
import { BsClockFill } from "react-icons/bs";
import { displayAddress } from "@/utils";
import { CelatoneUrl } from "@/const";
import { ConnectWalletHoverContent } from "@/app/programs/ui";
import { useWallet } from "@/hooks";

export const ProcessorDisplay = ({
  program,
}: {
  program?: GetProgramDataReturnValue;
}) => {
  const { isWalletConnected } = useWallet();
  const processorAddresses =
    program?.parsedProgram?.authorizationData?.processor_addrs;
  let processors = Array<[string, string]>();
  if (processorAddresses) {
    processors = Object.entries(processorAddresses);
  }

  if (!processors.length) {
    return (
      <Card className="grow h-full border-0">No processors to display.</Card>
    );
  }

  return processors.map(([domain, processorAddress]) => {
    const processorData = program?.processorQueues?.find(
      (q) => q.processorAddress === processorAddress,
    );
    const queue = processorData?.queue;

    const data =
      queue?.map((messageBatch) => {
        const { id, priority, retry, msgs, subroutine } = messageBatch;
        return {
          [ProcessorTableKeys.executionId]: { value: id.toString() },
          // [ProcessorTableKeys.subroutineLabel]: subroutine,
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
        className=""
        key={`processor-${processorAddresses}`}
      >
        <CollapsibleSectionHeader className="flex flex-row items-center gap-2 w-full  justify-between p-4 pb-0">
          <div className="flex flex-row gap-2 items-center">
            <HoverCardRoot>
              <HoverCardTrigger asChild>
                <Button
                  disabled={!isWalletConnected}
                  PrefixIcon={BsClockFill}
                  variant="secondary"
                  onClick={(e) => {
                    // prevent the parent collapsible section from toggling
                    e.stopPropagation();
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
  });
};

enum ProcessorTableKeys {
  executionId = "executionId",
  // subroutineLabel = "subroutineLabel",
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
  // {
  //   key: ProcessorTableKeys.subroutineLabel,
  //   label: "Subroutine Label",
  //   cellType: CellType.Text,
  // },
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
