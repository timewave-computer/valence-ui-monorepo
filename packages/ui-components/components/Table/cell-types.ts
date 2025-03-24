import { ElementType, ReactNode } from "react";
import { LabelProps } from "../Label";

export enum CellType {
  Number = "number",
  Text = "text",
  Asset = "asset",
  Label = "label",
  Sheet = "sheet",
}
export type CellTypes = `${CellType}`;

export type CellLink = {
  href: string;
  blankTarget?: boolean;
  LinkComponent?: ElementType<any>;
};
export interface NumberCellData {
  value: number;
  link?: CellLink;
  isUsd?: boolean;
  numberOptions?: Intl.NumberFormatOptions;
}
export interface TextCellData {
  value: string;
  link?: CellLink;
}
export interface AssetCellData {
  symbol: string;
  color: string;
}
export interface LabelCellData {
  value: string;
  color: LabelProps["variant"];
}
export interface SheetCellData {
  link: string;
  body: ReactNode;
}

export type CellDataMap = {
  [CellType.Number]: NumberCellData;
  [CellType.Text]: TextCellData;
  [CellType.Asset]: AssetCellData;
  [CellType.Label]: LabelCellData;
  [CellType.Sheet]: SheetCellData;
};

export type CellData<T extends CellTypes> = T extends keyof CellDataMap
  ? CellDataMap[T]
  : never;

// needed for type narrowing
export function isCellDataOfType<T extends CellTypes>(
  data: CellDataMap[keyof CellDataMap],
  cellType: T,
): data is CellData<T> {
  if (!data) return false;
  switch (cellType) {
    case CellType.Number:
      return (data as NumberCellData)?.value !== undefined;
    case CellType.Text:
      return (data as TextCellData)?.value !== undefined;
    case CellType.Asset:
      return (data as AssetCellData)?.symbol !== undefined;
    case CellType.Label:
      return (data as LabelCellData)?.value !== undefined;
    case CellType.Sheet:
      return (data as SheetCellData)?.link !== undefined;
    default:
      return false;
  }
}

// needed for type narrowing
export function isCellDataLinkable<T extends CellTypes>(
  data: CellDataMap[keyof CellDataMap],
  cellType: T,
): data is CellData<T> {
  if (!data) return false;
  switch (cellType) {
    case CellType.Number:
      return (data as NumberCellData)?.value !== undefined;
    case CellType.Text:
      return (data as TextCellData)?.value !== undefined;
    default:
      return false;
  }
}
