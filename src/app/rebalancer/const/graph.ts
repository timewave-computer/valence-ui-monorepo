import { UTCDate } from "@date-fns/utc";
import { subDays } from "date-fns";
import _ from "lodash";
import { ErrorHandler } from "@/const/error";
import { fnv1aHash } from "@/utils";
import { chainConfig } from "@/const/config";

export enum Scale {
  // these two are disabled for now, we only have historical day 1x per day
  // Hour = "h",
  // Day = "d",
  Week = "w",
  Month = "m",
  Year = "y",
}

export enum KeyTag {
  historicalAmount = ".historical-amount",
  historicalValue = ".historical-value",
  projectedValue = ".projected-value",
  projectedAmount = ".projected-amount",
  historicalTargetValue = ".historical-target-value",
  projectedTargetValue = ".projected-target-value",
}

export class GraphKey {
  static historicalAmount(symbol: string) {
    return `${symbol}${KeyTag.historicalAmount}`;
  }

  static historicalValue(symbol: string) {
    return `${symbol}${KeyTag.historicalValue}`;
  }
  static projectedValue(symbol: string) {
    return `${symbol}${KeyTag.projectedValue}`;
  }
  static projectedAmount(symbol: string) {
    return `${symbol}${KeyTag.projectedAmount}`;
  }
  static historicalTargetValue(symbol: string) {
    return `${symbol}${KeyTag.historicalTargetValue}`;
  }
  static projectedTargetValue(symbol: string) {
    return `${symbol}${KeyTag.projectedTargetValue}`;
  }
}

export const projectionLength: Record<Scale, number> = {
  // 1 day: 6 hours
  // 1 hour: 15 mins
  [Scale.Week]: 2, // days
  [Scale.Month]: 7, // days
  [Scale.Year]: 90, // days
};

export const scaleTickCount: Record<Scale, number> = {
  // [Scale.Hour]: 60, // per-minute
  // [Scale.Day]: 24, // per-hour
  [Scale.Week]: 7 + projectionLength[Scale.Week], // per day
  [Scale.Month]: 14 + projectionLength[Scale.Month], // per day
  [Scale.Year]: 12 + projectionLength[Scale.Year] / 30, // per month
};
export const scaleIntervalSeconds: Record<Scale, number> = {
  // [Scale.Hour]: 60, // per-minute
  // [Scale.Day]: 60 * 60, // per-hour
  [Scale.Week]: 24 * 60 * 60, // per day
  [Scale.Month]: 24 * 60 * 60, // per day
  [Scale.Year]: 30 * 24 * 60 * 60, // per month
};

export const scaleFormatter: Record<Scale, (value: number) => string> = {
  //   [Scale.Hour]: (value) =>
  //    new Date(value).toLocaleTimeString("default", { timeStyle: "short" }),
  //   [Scale.Day]: (value) => new Date(value).getHours().toString(),
  [Scale.Week]: (value) => {
    const date = new Date(value);
    const day = date.getDate(); // Get the day of the month (1-31)
    const month = date.getMonth() + 1; // Get the month (0-indexed, so add 1)
    return `${month}/${day}`;
  },
  [Scale.Month]: (value) => {
    const date = new Date(value);
    const day = date.getDate(); // Get the day of the month (1-31)
    const month = date.getMonth() + 1; // Get the month (0-indexed, so add 1)
    return `${month}/${day}`;
  },
  [Scale.Year]: (value) => {
    const date = new Date(value);
    return date.toLocaleString("default", { month: "short" }).toUpperCase();
  },
};

export const dayCountForScale: Record<Scale, number> = {
  // [Scale.Hour]: 1,
  // [Scale.Day]: 1,
  [Scale.Week]: 7,
  [Scale.Month]: 30,
  [Scale.Year]: 365,
};

export const minTimestampGenerator = (startValue: number, dayCount: number) => {
  const date = new UTCDate(startValue);
  return subDays(date, dayCount).getTime();
};

export const yTickCount = 11;

const COLORS = [
  "#FF2A00", // red
  "#00A3FF", // blue
  "#EA80D1", // pink
  "#4EBB5B", // green
  "#FFBC57", // orange
  "#800000", // brown
  "#BABABA", // gray
  "#C2C600", // yellow
  "#8476DE", // purple
  "#17CFCF", // teal
] as const;

export type GraphColor = (typeof COLORS)[number];

// these are the 'supported' colors for assets. colors are hardcoded
// todo: make this dynamic

class SymbolColorsClass {
  private assetColors: Record<string, GraphColor>;
  private unassignedColors: GraphColor[];

  constructor() {
    const colorMap: Record<string, GraphColor> = {};
    chainConfig.supportedAssets.forEach((asset, i) => {
      colorMap[asset.symbol] = COLORS[i];
    });
    this.assetColors = colorMap;
    this.unassignedColors = COLORS.slice(_.size(colorMap));
  }

  private getUnassignedColor(value: string) {
    // deterministically select an unassigned color
    const hash = fnv1aHash(value);
    const index = Number(hash % BigInt(this.unassignedColors.length));
    return this.unassignedColors[index];
  }

  public get(symbol: string): GraphColor {
    const assetColors = this.assetColors;
    if (symbol in assetColors) {
      return assetColors[symbol] as (typeof COLORS)[0];
    }
    // if not 'supported' color, deterministally assign a color
    else {
      ErrorHandler.warn(`No color assigned for symbol ${symbol}`);
      return this.getUnassignedColor(symbol);
    }
  }
}

export const SymbolColors = new SymbolColorsClass();

export const targetLabelIndex: Record<Scale, (length: number) => number> = {
  [Scale.Week]: (length) => {
    return Math.min(1, length);
  },
  [Scale.Month]: (length) => {
    return Math.min(2, length);
  },
  [Scale.Year]: (length) => {
    return Math.min(15, length);
  },
};

export const GraphStyles = {
  width: {
    regular: 1.4,
    thin: 0.45,
  },
  lineStyle: {
    solid: "",
    dotted: "3 3",
  },
};
