import { chainConfig } from "@/const/config";
import { ErrorHandler } from "@/const/error";
import { fnv1aHash } from "@/utils";
import _ from "lodash";

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
    chainConfig.supportedRebalancerAssets.forEach((asset, i) => {
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
