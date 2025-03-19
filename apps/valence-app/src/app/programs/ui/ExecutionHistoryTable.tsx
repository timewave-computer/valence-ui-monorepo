import {
  CellType,
  Heading,
  PrettyJson,
  Table,
  type TableColumnHeader,
} from "@valence-ui/ui-components";
import { type GetProgramDataReturnValue } from "@/app/programs/server";
import { fromUnixTime } from "date-fns";

export const ExecutionHistoryTable = ({
  program,
}: {
  program?: GetProgramDataReturnValue;
}) => {
  const data = program?.processorHistory?.map((processorItem) => {
    const createAtDate = fromUnixTime(processorItem.created_at);
    const lastUpdatedDate = fromUnixTime(processorItem.last_updated_at);

    return {
      [ExecutionHistoryTableKeys.executionId]: {
        value: processorItem.execution_id.toString(),
      },
      [ExecutionHistoryTableKeys.label]: {
        value: processorItem.label,
      },
      [ExecutionHistoryTableKeys.executionResult]: {
        value: JSON.stringify(processorItem.execution_result),
      },
      [ExecutionHistoryTableKeys.messages]: {
        link: "View",
        body: (
          <>
            <Heading level="h2">Messages</Heading>
            <PrettyJson data={processorItem.messages} />
          </>
        ),
      },
      [ExecutionHistoryTableKeys.domain]: {
        value: JSON.stringify(processorItem.domain),
      },
      [ExecutionHistoryTableKeys.createdAt]: {
        value: createAtDate.toLocaleString() ?? "-",
      },
      [ExecutionHistoryTableKeys.lastUpdated]: {
        value: lastUpdatedDate.toLocaleString() ?? "-",
      },
      [ExecutionHistoryTableKeys.initiator]: {
        value: JSON.stringify(processorItem.initiator),
      },
      [ExecutionHistoryTableKeys.processorCallbackAddress]: {
        value: processorItem.processor_callback_address,
      },
      [ExecutionHistoryTableKeys.bridgeCallbackAddress]: {
        value: processorItem.bridge_callback_address ?? "-",
      },
    };
  });

  return <Table variant="secondary" headers={headers} data={data ?? []} />;
};

enum ExecutionHistoryTableKeys {
  executionId = "executionId",
  label = "label",
  executionResult = "executionResult",
  messages = "messages",
  domain = "domain",
  initiator = "initiator",
  lastUpdated = "lastUpdated",
  createdAt = "createdAt",
  processorCallbackAddress = "processorCallbackAddress",
  bridgeCallbackAddress = "bridgeCallbackAddress",
}
const headers: TableColumnHeader[] = [
  {
    key: ExecutionHistoryTableKeys.executionId,
    label: "Execution ID",
    cellType: CellType.Number,
  },
  {
    key: ExecutionHistoryTableKeys.label,
    label: "Label",
    cellType: CellType.Text,
  },
  {
    key: ExecutionHistoryTableKeys.executionResult,
    label: "Execution Result",
    cellType: CellType.Text,
  },
  {
    key: ExecutionHistoryTableKeys.messages,
    label: "Messages",
    cellType: CellType.Sheet,
  },
  {
    key: ExecutionHistoryTableKeys.domain,
    label: "Domain",
    cellType: CellType.Text,
  },
  {
    key: ExecutionHistoryTableKeys.lastUpdated,
    label: "Last Updated",
    cellType: CellType.Text,
  },
  {
    key: ExecutionHistoryTableKeys.createdAt,
    label: "Created At",
    cellType: CellType.Text,
  },
  {
    key: ExecutionHistoryTableKeys.initiator,
    label: "Initiator",
    cellType: CellType.Text,
  },
  {
    key: ExecutionHistoryTableKeys.processorCallbackAddress,
    label: "Processor Callback Address",
    cellType: CellType.Text,
  },
  {
    key: ExecutionHistoryTableKeys.bridgeCallbackAddress,
    label: "Bridge Callback Address",
    cellType: CellType.Text,
  },
];
