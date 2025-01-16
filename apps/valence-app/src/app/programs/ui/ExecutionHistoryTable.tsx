import {
  CellType,
  Table,
  type TableColumnHeader,
} from "@valence-ui/ui-components";

export const ExecutionHistoryTable = () => {
  return <Table variant="secondary" headers={headers} data={[]} />;
};

enum ExecutionHistoryTableKeys {
  executionId = "executionId",
  subroutine = "subroutine",
  status = "status",
  address = "address",
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
    cellType: CellType.Text,
  },
  {
    key: ExecutionHistoryTableKeys.subroutine,
    label: "Subroutine",
    cellType: CellType.Text,
  },
  {
    key: ExecutionHistoryTableKeys.status,
    label: "Status",
    cellType: CellType.Label,
  },
  {
    key: ExecutionHistoryTableKeys.address,
    label: "Address",
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
    cellType: CellType.Text,
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
