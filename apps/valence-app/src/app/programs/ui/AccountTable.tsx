import {
  CellType,
  Table,
  type TableColumnHeader,
} from "@valence-ui/ui-components";

export const AccountTable = () => {
  return <Table variant="secondary" headers={headers} data={[]} />;
};

const headers: TableColumnHeader[] = [
  {
    key: "label",
    label: "Label",
    cellType: CellType.Text,
  },
  {
    key: "domain",
    label: "Domain",
    cellType: CellType.Text,
  },
  {
    key: "balances",
    label: "Balances",
    cellType: CellType.Text,
  },
  {
    key: "address",
    label: "Address",
    cellType: CellType.Text,
  },
];
