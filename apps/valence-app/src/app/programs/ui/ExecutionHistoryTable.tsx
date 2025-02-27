import { MUTATION_KEYS } from "@/const";
import { utf8ToJson } from "@/utils";
import { fromUtf8 } from "@cosmjs/encoding";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { useMutationState } from "@tanstack/react-query";
import {
  CellType,
  Table,
  TableRow,
  type TableColumnHeader,
} from "@valence-ui/ui-components";

export const ExecutionHistoryTable = ({
  programId,
}: {
  programId?: string;
}) => {
  const cachedTicks = useMutationState<Array<DeliverTxResponse | undefined>>({
    // this mutation key needs to match the mutation key of the given mutation (see above)
    filters: { mutationKey: [MUTATION_KEYS.PROGRAMS_TICK, programId] },
    select: (mutation) =>
      mutation.state.data as Array<DeliverTxResponse | undefined>,
  });
  console.log("cachedTicks", cachedTicks);

  const data = cachedTicks.reduce((acc, tickResult) => {
    console.log("tick result", tickResult);
    if (tickResult) {
      const result = tickResult.msgResponses[0].value;
      console.log("result from utf8", result, fromUtf8(result));

      let executionId = "-";
      tickResult.events.forEach((event) => {
        if (event.type === "wasm") {
          event.attributes.forEach((attr) => {
            if (attr.key === "execution_id") {
              executionId = attr.value;
            }
          });
        }
      });
      acc.push({
        [ExecutionHistoryTableKeys.executionId]: {
          value: executionId,
        },
        [ExecutionHistoryTableKeys.executionResult]: {
          value: fromUtf8(result),
        },
      });
    }
    return acc;
  }, [] as Array<TableRow>);

  return <Table variant="secondary" headers={headers} data={data} />;
};

enum ExecutionHistoryTableKeys {
  executionId = "executionId",
  subroutine = "subroutine",
  status = "status",
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
  // {
  //   key: ExecutionHistoryTableKeys.subroutine,
  //   label: "Subroutine",
  //   cellType: CellType.Text,
  // },
  {
    key: ExecutionHistoryTableKeys.status,
    label: "Status",
    cellType: CellType.Label,
  },
  {
    key: ExecutionHistoryTableKeys.executionResult,
    label: "Execution Result",
    cellType: CellType.Text,
  },
  // {
  //   key: ExecutionHistoryTableKeys.messages,
  //   label: "Messages",
  //   cellType: CellType.Text,
  // },
  // {
  //   key: ExecutionHistoryTableKeys.domain,
  //   label: "Domain",
  //   cellType: CellType.Text,
  // },
  // {
  //   key: ExecutionHistoryTableKeys.lastUpdated,
  //   label: "Last Updated",
  //   cellType: CellType.Text,
  // },
  // {
  //   key: ExecutionHistoryTableKeys.createdAt,
  //   label: "Created At",
  //   cellType: CellType.Text,
  // },
  // {
  //   key: ExecutionHistoryTableKeys.processorCallbackAddress,
  //   label: "Processor Callback Address",
  //   cellType: CellType.Text,
  // },
  // {
  //   key: ExecutionHistoryTableKeys.bridgeCallbackAddress,
  //   label: "Bridge Callback Address",
  //   cellType: CellType.Text,
  // },
];
