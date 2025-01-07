import { LabelProps, Label } from "../Label";
import { Asset } from "./Asset";
import { HeaderVariants } from "./SortableTableHeader";
import { TableCell } from "./TableCell";

export enum Cells {
  Number = "number",
  Text = "text",
  Asset = "asset",
  Label = "label",
}
export type CellType = `${Cells}`;

interface NumberCellData {
  value: number;
}

interface TableCellData {
  value: string;
}

interface AssetCellData {
  symbol: string;
  color: string;
}

interface LabelCellData {
  value: string;
  color: LabelProps["color"];
}

type CellDataMap = {
  [Cells.Number]: NumberCellData;
  [Cells.Text]: TableCellData;
  [Cells.Asset]: AssetCellData;
  [Cells.Label]: LabelCellData;
};

export type CellData<T extends CellType> = T extends keyof CellDataMap
  ? CellDataMap[T]
  : never;

export const TableCells: {
  [K in CellType]: {
    renderer: (value: CellData<K>, variants: HeaderVariants) => React.ReactNode;
    sorter: (a: CellData<K>, b: CellData<K>, ascending: boolean) => number;
  };
} = {
  [Cells.Number]: {
    renderer: (data: NumberCellData, variants) => (
      <TableCell {...variants}>{data.value}</TableCell>
    ),
    sorter: (a: NumberCellData, b: NumberCellData, ascending) =>
      compareNumbers(a.value, b.value, ascending),
  },
  [Cells.Text]: {
    renderer: (data: TableCellData, variants) => (
      <TableCell {...variants}>{data.value}</TableCell>
    ),
    sorter: (a: TableCellData, b: TableCellData, ascending) =>
      compareStrings(a.value, b.value, ascending),
  },
  [Cells.Asset]: {
    renderer: (data: AssetCellData, variants) => (
      <TableCell {...variants}>
        <Asset color={data.color} symbol={data.symbol} />
      </TableCell>
    ),
    sorter: (a: AssetCellData, b: AssetCellData, ascending) =>
      compareStrings(a.symbol, b.symbol, ascending),
  },
  [Cells.Label]: {
    renderer: (data: LabelCellData, variants) => (
      <TableCell {...variants}>
        <Label className="w-full" variant={data.color}>
          {data.value}
        </Label>
      </TableCell>
    ),
    sorter: (a: LabelCellData, b: LabelCellData, ascending) =>
      compareStrings(a.value, b.value, ascending),
  },
};

function compareStrings<T extends string>(a: T, b: T, ascending: boolean) {
  return ascending ? a.localeCompare(b) : b.localeCompare(a);
}
function compareNumbers<T extends number | string>(
  _a: T,
  _b: T,
  ascending: boolean,
) {
  const a = Number(_a);
  const b = Number(_b);
  return ascending ? a - b : b - a;
}
