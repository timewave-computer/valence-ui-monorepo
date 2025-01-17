import { Label } from "../Label";
import { Asset } from "../Asset";
import { TableCell, type TableCellVariants } from "./TableCell";
import {
  type CellData,
  type CellTypes,
  CellType,
  type NumberCellData,
  type AssetCellData,
  type TextCellData,
  type LabelCellData,
} from "./cell-types";

const createRenderer =
  <K extends CellTypes>(
    renderContent: (data: CellData<K>) => React.ReactNode,
  ) =>
  (data: CellData<K>, variants: TableCellVariants): React.ReactNode => (
    <TableCell
      // @ts-expect-error data typed as never
      link={data?.link}
      {...variants}
    >
      {renderContent(data)}
    </TableCell>
  );

interface TableCellData<T> {
  renderer: (data: T, variants: TableCellVariants) => React.ReactNode;
  sorter: (a: T, b: T, ascending: boolean) => number;
  renderDefault: (data: any, variants: TableCellVariants) => React.ReactNode;
}

type TableCells = {
  [K in CellTypes]: TableCellData<CellData<K>>;
};

export const TableCells: TableCells = {
  [CellType.Number]: {
    renderer: createRenderer<CellType.Number>((data) => (
      <>
        {`${data.isUsd ? "$" : ""}`}
        {data.value}
      </>
    )),
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
  return ascending
    ? String(a)?.localeCompare(String(b))
    : String(b)?.localeCompare(String(a));
}
function compareNumbers<T extends number | string | undefined>(
  _a: T,
  _b: T,
  ascending: boolean,
) {
  const a = Number(_a);
  const b = Number(_b);
  if (isNaN(a) && isNaN(b)) return 0;
  if (isNaN(a)) return ascending ? 1 : -1;
  if (isNaN(b)) return ascending ? -1 : 1;
  return ascending ? a - b : b - a;
}
