"use client";
import { Fragment, useMemo, useState } from "react";
import { cn } from "../../utils";
import { SortableTableHeader } from "./SortableTableHeader";
import { cva, VariantProps } from "class-variance-authority";
import {
  CellDataMap,
  CellType,
  CellTypes,
  isCellDataOfType,
  TableCells,
} from "./cell-types";

// TODO:
// 4. loading states, empty view (spec in header)
// 3. add some protection around header keys and data keys lining up (maybe just warnings). or TS
//      - if a header key is added, make sure the data has that key ?

const tableVariants = cva("", {
  variants: {
    variant: {
      primary: "",
      secondary: "",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});
export type TableVariants = VariantProps<typeof tableVariants>;

export type TableHeader = {
  label: string;
  key: string;
  cellType: CellTypes;
  hoverTooltip?: React.ReactNode;
  align?: "left" | "right" | "center";
};
export type TableRow = {
  [key: string]: CellDataMap[keyof CellDataMap];
};

interface TableProps
  extends React.HTMLAttributes<HTMLDivElement>,
    TableVariants {
  headers: Array<TableHeader>;
  data: Array<TableRow>;
  tableId: string; // must be unique for each table on same page. required for mapping over keys without collisions.
}
type ValueOf<T> = T[keyof T];
export const Table = ({
  children,
  className,
  headers,
  data: _data,
  tableId,
  variant = "primary",
  ...props
}: TableProps) => {
  const [sortAscending, setSortAscending] = useState(false);
  const [currentSortKey, setCurrentSortKey] = useState<string>(headers[0].key);
  const sorterCellType = headers.find(
    (header) => header.key === currentSortKey,
  )?.cellType;

  const sorterFunc =
    !!sorterCellType && sorterCellType in TableCells
      ? TableCells[sorterCellType].sorter
      : undefined;

  const sortedData = useMemo(() => {
    if (!sorterFunc) return _data;

    return _data.sort((a, b) =>
      // @ts-expect-error. typescript incorrectly infers the sorter params as type 'never'
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
            currentSorter={
              sorterFunc ? { key: header.key, sort: sorterFunc } : undefined
            }
            ascending={sortAscending}
            setSorter={() => {
              setCurrentSortKey(header.key);
            }}
            hoverTooltip={header.hoverTooltip}
            setSortAscending={setSortAscending}
            variant={variant}
            align={header.align}
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
              const renderer = TableCells[cellType].renderer;
              if (isCellDataOfType(data, cellType)) {
                const cell = renderer(data, {
                  variant,
                  align: header.align,
                });
                return (
                  <Fragment
                    key={`tablecell-${tableId}-${header.key}-${rowIndex}`}
                  >
                    {cell}
                  </Fragment>
                );
              }
            })}
          </Fragment>
        );
      })}
    </div>
  );
};
