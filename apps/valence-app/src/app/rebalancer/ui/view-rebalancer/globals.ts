import { atom } from "jotai";
import { Scale } from "@/app/rebalancer/ui";
import { chainConfig } from "@/const/config";
// TODO: this file should be in the 'view' section but it causes a circular import
export const accountAtom = atom("");
export const scaleAtom = atom<Scale>(Scale.Month);
export const baseDenomAtom = atom<string>(chainConfig.defaultBaseTokenDenom);
export const priceSourceAtom = atom<"coingecko" | "oracle">("coingecko");
