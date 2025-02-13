import { atom } from "jotai";
import { Scale } from "@/app/rebalancer/ui";
import { chainConfig } from "@/const/config";
// TODO: rest of these should be replaced with nuqs usage
export const scaleAtom = atom<Scale>(Scale.Month);
export const baseDenomAtom = atom<string>(chainConfig.defaultBaseTokenDenom);
export const priceSourceAtom = atom<"coingecko" | "oracle">("coingecko");
