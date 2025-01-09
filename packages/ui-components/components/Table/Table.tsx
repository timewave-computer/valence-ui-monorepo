"use client";
import { Fragment, useMemo, useState, useId } from "react";
import { cn } from "../../utils";
import { cva, VariantProps } from "class-variance-authority";
import {
  CellDataMap,
  CellTypes,
  isCellDataOfType,
  TableCells,
} from "./cell-types";
import { TableHeader } from "./TableHeader";
import { TableCell } from "./TableCell";

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

export type TableColumnHeader = {
  label: string;
  key: string;
  cellType: CellTypes;
  hoverTooltip?: React.ReactNode;
  align?: "left" | "right" | "center";
};

type ValueOf<T> = T[keyof T];
export type TableRow = {
  [key: string]: ValueOf<CellDataMap>;
};

interface TableProps
  extends React.HTMLAttributes<HTMLDivElement>,
    TableVariants {
  headers: Array<TableColumnHeader>;
  data: Array<TableRow>;
  isLoading?: boolean;
  loadingRows?: number;
}

export const Table = ({
  children,
  className,
  headers,
  data: _data,
  variant = "primary",
  isLoading,
  loadingRows = 3,
  ...props
}: TableProps) => {
  const tableId = useId(); // for unique key generation for multiple tables
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

    return [..._data].sort((a, b) =>
      // @ts-expect-error. typescript incorrectly infers the sort params as type 'never'
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
          <TableHeader
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

      {isLoading && (
        <>
          {Array.from({ length: loadingRows }).map((_, index) =>
            headers.map((header) => (
              <Fragment key={`emptytablerow-${tableId}-${header.key}-${index}`}>
                <TableCell variant={variant} align={header.align} isLoading />
              </Fragment>
            )),
          )}
        </>
      )}

      {!isLoading && sortedData.length === 0 && (
        <>
          {headers.map((header) => {
            const cellType = header.cellType;
            const cellFunctions = TableCells[cellType];

            return (
              <Fragment key={`emptytablerow-${tableId}-${header.key}`}>
                {cellFunctions.renderDefault(undefined, {
                  variant,
                  align: header.align,
                })}
              </Fragment>
            );
          })}
        </>
      )}

      {!isLoading &&
        sortedData.map((row, rowIndex) => {
          return (
            <Fragment key={`tablerow-${tableId}-${rowIndex}`}>
              {headers.map((header) => {
                const rowData = row[header.key];
                const cellType = header.cellType;
                const cellFunctions = TableCells[cellType];

                let cell: React.ReactNode;
                if (!rowData || !isCellDataOfType(rowData, cellType)) {
                  const renderer = cellFunctions.renderDefault;
                  cell = renderer(undefined, {
                    variant,
                    align: header.align,
                  });
                } else {
                  const renderer = cellFunctions.renderer;
                  cell = renderer(rowData, {
                    variant,
                    align: header.align,
                  });
                }

                return (
                  <Fragment
                    key={`tablecell-${tableId}-${header.key}-${rowIndex}`}
                  >
                    {cell}
                  </Fragment>
                );
              })}
            </Fragment>
          );
        })}
    </div>
  );
};
