import {
  Card,
  CellType,
  type TableColumnHeader,
} from "@valence-ui/ui-components";
import { GetProgramDataReturnValue } from "@/app/programs/server";
import { ProcessorSection } from "@/app/programs/ui";

export const ProcessorDisplay = ({
  program,
}: {
  program?: GetProgramDataReturnValue;
}) => {
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

    return (
      <ProcessorSection
        key={`processor-table-${processorAddress}`}
        processorData={processorData}
        processorAddress={processorAddress}
        domain={domain}
      />
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
