enum Cell {
  Number = "number",
  Text = "text",
  Asset = "asset",
  Label = "label",
}
export type CellType = `${Cell}`;

interface NumberCellData {
  value: number;
}

interface TextCellData {
  value: string;
}

interface AssetCellData {
  symbol: string;
  color: string;
}

interface LabelCellData {
  value: string;
}

type CellDataMap = {
  [Cell.Number]: NumberCellData;
  [Cell.Text]: TextCellData;
  [Cell.Asset]: AssetCellData;
  [Cell.Label]: LabelCellData;
};

export type CellData<T extends CellType> = T extends keyof CellDataMap
  ? CellDataMap[T]
  : never;

export const TableCells: {
  [K in CellType]: {
    renderer: (value: CellData<K>) => React.ReactNode;
    sorter: (a: CellData<K>, b: CellData<K>, ascending: boolean) => number;
  };
} = {
  [Cell.Number]: {
    renderer: (data: NumberCellData) => <span>{data.value}</span>,
    sorter: (a: NumberCellData, b: NumberCellData, ascending) =>
      compareNumbers(a.value, b.value, ascending),
  },
  [Cell.Text]: {
    renderer: (data: TextCellData) => <span>{data.value}</span>,
    sorter: (a: TextCellData, b: TextCellData, ascending) =>
      compareStrings(a.value, b.value, ascending),
  },
  [Cell.Asset]: {
    renderer: (data: AssetCellData) => (
      <span style={{ color: data.color }}>{data.symbol}</span>
    ),
    sorter: (a: AssetCellData, b: AssetCellData, ascending) =>
      compareStrings(a.symbol, b.symbol, ascending),
  },
  [Cell.Label]: {
    renderer: (data: LabelCellData) => <span>{data.value}</span>,
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
