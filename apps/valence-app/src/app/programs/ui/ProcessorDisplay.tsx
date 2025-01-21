import {
  Button,
  CellType,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
  Heading,
  LinkText,
  Table,
  type TableColumnHeader,
} from "@valence-ui/ui-components";
import { GetProgramDataReturnValue } from "@/app/programs/server";
import { BsClockFill } from "react-icons/bs";
import { displayAddress } from "@/utils";
import { CelatoneUrl } from "@/const";

export const ProcessorDisplay = ({
  program,
}: {
  program: GetProgramDataReturnValue;
}) => {
  const processorAddresses = program.authorizationData?.processor_addrs;
  let processors = Array<[string, string]>();
  if (processorAddresses) {
    processors = Object.entries(processorAddresses);
  }

  return processors.map(([domain, processorAddress]) => {
    return (
      <CollapsibleSectionRoot
        className=""
        key={`processor-${processorAddresses}`}
      >
        <CollapsibleSectionHeader className="flex flex-row items-center gap-2 w-full  justify-between p-4 pb-0">
          <div className="flex flex-row gap-2">
            <Button
              SuffixIcon={BsClockFill}
              variant="secondary"
              onClick={(e) => {
                // prevent the parent collapsible section from toggling
                e.stopPropagation();
                alert("got eem");
              }}
            >
              Tick
            </Button>
            <div className="flex flex-col gap-1 items-start">
              <Heading level="h3">{domain}</Heading>
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
          <Table
            className="p-2"
            variant="secondary"
            headers={headers}
            data={[]}
          />
        </CollapsibleSectionContent>
      </CollapsibleSectionRoot>
    );
  });
};

enum ProcessorTableKeys {
  executionId = "executionId",
  subroutineLabel = "subroutineLabel",
  priority = "priority",
  retryCounts = "retryCounts",
  retryCooldown = "retryCooldown",
  messages = "messages",
}

const headers: TableColumnHeader[] = [
  {
    key: ProcessorTableKeys.executionId,
    label: "Execution ID",
    cellType: CellType.Text,
  },
  {
    key: ProcessorTableKeys.subroutineLabel,
    label: "Subroutine Label",
    cellType: CellType.Text,
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
    cellType: CellType.Label,
  },
];
