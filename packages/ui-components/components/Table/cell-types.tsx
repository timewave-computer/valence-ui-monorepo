import { ElementType } from "react";
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

export type CellLink = {
  href: string;
  blankTarget?: boolean;
  LinkComponent?: ElementType<any>;
};
interface NumberCellData {
  value: string;
  link?: CellLink;
}

interface TextCellData {
  value: string;
  link?: CellLink;
}

interface AssetCellData {
  symbol: string;
  color: string;
}

interface LabelCellData {
  value: string;
  color: LabelProps["variant"];
}

export type CellDataMap = {
  [Cells.Number]: NumberCellData;
  [Cells.Text]: TextCellData;
  [Cells.Asset]: AssetCellData;
  [Cells.Label]: LabelCellData;
};

export type CellData<T extends CellType> = T extends keyof CellDataMap
  ? CellDataMap[T]
  : never;

const createRenderer =
  <K extends CellType>(renderContent: (data: CellData<K>) => React.ReactNode) =>
  (data: CellData<K>, variants: HeaderVariants): React.ReactNode => (
    <TableCell {...variants}>{renderContent(data)}</TableCell>
  );

export const TableCells: {
  [K in CellType]: {
    renderer: (value: CellData<K>, variants: HeaderVariants) => React.ReactNode;
    sorter: (a: CellData<K>, b: CellData<K>, ascending: boolean) => number;
  };
} = {
  [Cells.Number]: {
    renderer: createRenderer<Cells.Number>((data) => <>{data.value}</>),
    sorter: (a: NumberCellData, b: NumberCellData, ascending) =>
      compareNumbers(a.value, b.value, ascending),
  },
  [Cells.Text]: {
    renderer: createRenderer<Cells.Text>((data) => <>{data.value}</>),
    sorter: (a: TextCellData, b: TextCellData, ascending) =>
      compareStrings(a.value, b.value, ascending),
  },
  [Cells.Asset]: {
    renderer: createRenderer<Cells.Asset>((data) => (
      <Asset color={data.color} symbol={data.symbol} />
    )),
    sorter: (a: AssetCellData, b: AssetCellData, ascending) =>
      compareStrings(a.symbol, b.symbol, ascending),
  },
  [Cells.Label]: {
    renderer: createRenderer<Cells.Label>((data) => (
      <Label className="w-full" variant={data.color}>
        {data.value}
      </Label>
    )),
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
