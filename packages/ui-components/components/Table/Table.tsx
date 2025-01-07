"use client";
import { Fragment, useMemo, useState } from "react";
import { cn } from "../../utils";
import { SortableTableHeader } from "./SortableTableHeader";

// TODO:
// 1. add proper styles for cell headers
// 2. style cell renderers with a genernal cell body + hrefs
// 3. add some protection around header keys and data keys lining up (maybe just warnings)

enum Cell {
  Number = "number",
  Text = "text",
  Asset = "asset",
  Label = "label",
}
type CellType = `${Cell}`;

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

type CellData<T extends CellType> = T extends keyof CellDataMap
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

type TableHeaderCellProps = {
  label: string;
  key: string;
  cellType: CellType;
  href?: string;
};

type RowData = {
  [key: string]: CellData<CellType>;
};

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  headers: Array<TableHeaderCellProps>;
  data: Array<RowData>;
  tableId: string; // must be unique for each table on same page. required for mapping over keys without collisions.
}

export const TableRoot = ({
  children,
  className,
  headers,
  data: _data,
  tableId,
  ...props
}: RootProps) => {
  const [sortAscending, setSortAscending] = useState(false);
  const [currentSortKey, setCurrentSortKey] = useState<string>(headers[0].key);
  const sorterCellType = headers.find(
    (header) => header.key === currentSortKey,
  )?.cellType;
  const sorterFunc = TableCells[sorterCellType].sorter;

  const sortedData = useMemo(() => {
    return _data.sort((a, b) =>
      sorterFunc(a[currentSortKey], b[currentSortKey], sortAscending),
    );
  }, [sorterFunc, currentSortKey, sortAscending, _data]);

  const gridTemplateColumns = `repeat(${headers.length}, auto)`;

  return (
    <div
      className={cn("grid", className)}
      {...props}
      style={{ gridTemplateColumns }}
    >
      {headers.map((header) => {
        return (
          <SortableTableHeader
            key={`tablehead-${tableId}-${header.key}`}
            label={header.label}
            sorterKey={currentSortKey}
            currentSorter={{ key: header.key, sort: sorterFunc }}
            ascending={sortAscending}
            setSorter={() => {
              setCurrentSortKey(header.key);
            }}
            setSortAscending={setSortAscending}
            buttonClassName="pt-0 justify-start px-0  border-y-0"
            textClassName="text-xs font-base "
          />
        );
      })}
      {sortedData.map((row, rowIndex) => {
        const keys = Object.keys(row);
        return (
          <Fragment key={`tablerow-${tableId}-${rowIndex}`}>
            {keys.map((key) => {
              const header = headers.find((header) => header.key === key);
              const cellType = header?.cellType;
              if (!cellType) return <div>-</div>;
              const data = row[key];

              const cell = TableCells[cellType].renderer(data);
              return (
                <div key={`tablecell-${tableId}-${header.key}-${rowIndex}`}>
                  {cell}
                </div>
              );
            })}
          </Fragment>
        );
      })}
      {children}
    </div>
  );
};

export function compareStrings<T extends string>(
  a: T,
  b: T,
  ascending: boolean,
) {
  return ascending ? a.localeCompare(b) : b.localeCompare(a);
}
export function compareNumbers<T extends number | string>(
  _a: T,
  _b: T,
  ascending: boolean,
) {
  const a = Number(_a);
  const b = Number(_b);
  return ascending ? a - b : b - a;
}
