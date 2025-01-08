import { ElementType } from "react";
import { LabelProps, Label } from "../Label";
import { Asset } from "./Asset";
import { HeaderVariants } from "./TableHeader";
import { TableCell } from "./TableCell";

export enum CellType {
  Number = "number",
  Text = "text",
  Asset = "asset",
  Label = "label",
}
export type CellTypes = `${CellType}`;

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
  [CellType.Number]: NumberCellData;
  [CellType.Text]: TextCellData;
  [CellType.Asset]: AssetCellData;
  [CellType.Label]: LabelCellData;
};

export type CellData<T extends CellTypes> = T extends keyof CellDataMap
  ? CellDataMap[T]
  : never;

const createRenderer =
  <K extends CellTypes>(
    renderContent: (data: CellData<K>) => React.ReactNode,
  ) =>
  (data: CellData<K>, variants: HeaderVariants): React.ReactNode => (
    <TableCell {...variants}>{renderContent(data)}</TableCell>
  );

interface TableCellData<T> {
  renderer: (data: T, variants: HeaderVariants) => React.ReactNode;
  sorter: (a: T, b: T, ascending: boolean) => number;
  renderDefault: (data: any, variants: HeaderVariants) => React.ReactNode;
}

// needed for type narrowing
export function isCellDataOfType<T extends CellTypes>(
  data: CellDataMap[keyof CellDataMap],
  cellType: T,
): data is CellData<T> {
  switch (cellType) {
    case CellType.Number:
      return (data as NumberCellData)?.value !== undefined;
    case CellType.Text:
      return (data as TextCellData)?.value !== undefined;
    case CellType.Asset:
      return (data as AssetCellData)?.symbol !== undefined;
    case CellType.Label:
      return (data as LabelCellData)?.value !== undefined;
    default:
      return false;
  }
}

type TableCells = {
  [K in CellTypes]: TableCellData<CellData<K>>;
};

export const TableCells: TableCells = {
  [CellType.Number]: {
    renderer: createRenderer<CellType.Number>((data) => <>{data.value}</>),
    sorter: (a: NumberCellData, b: NumberCellData, ascending) =>
      compareNumbers(a?.value, b?.value, ascending),
    renderDefault: createRenderer<CellType.Text>(() => <>0.00</>),
  },
  [CellType.Text]: {
    renderer: createRenderer<CellType.Text>((data) => <>{data.value}</>),
    sorter: (a: TextCellData, b: TextCellData, ascending) =>
      compareStrings(a?.value, b?.value, ascending),
    renderDefault: createRenderer<CellType.Text>(() => <>-</>),
  },
  [CellType.Asset]: {
    renderer: createRenderer<CellType.Asset>((data) => (
      <Asset color={data.color} symbol={data.symbol} />
    )),
    sorter: (a: AssetCellData, b: AssetCellData, ascending) =>
      compareStrings(a?.symbol, b?.symbol, ascending),
    renderDefault: createRenderer<CellType.Text>(() => <>-</>),
  },
  [CellType.Label]: {
    renderer: createRenderer<CellType.Label>((data) => (
      <Label className="w-full" variant={data.color}>
        {data.value}
      </Label>
    )),
    sorter: (a: LabelCellData, b: LabelCellData, ascending) =>
      compareStrings(a?.value, b?.value, ascending),
    renderDefault: createRenderer<CellType.Text>(() => <>-</>),
  },
};

function compareStrings<T extends string>(
  _a: T | undefined,
  _b: T | undefined,
  ascending: boolean,
) {
  const a = _a ?? "";
  const b = _b ?? "";
  return ascending ? a?.localeCompare(b) : b?.localeCompare(a);
}
function compareNumbers<T extends number | string | undefined>(
  _a: T,
  _b: T,
  ascending: boolean,
) {
  const a = Number(_a);
  const b = Number(_b);
  return ascending ? a - b : b - a;
}
