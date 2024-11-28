import { atom } from "jotai";
import { Scale } from "@/app/rebalancer/const";
import { chainConfig } from "@/const/config";

export const accountAtom = atom("");
export const scaleAtom = atom<Scale>(Scale.Month);
export const baseDenomAtom = atom<string>(chainConfig.defaultBaseTokenDenom);
export const priceSourceAtom = atom<"coingecko" | "oracle">("coingecko");
