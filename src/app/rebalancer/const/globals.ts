import { atom } from "jotai";
import { DEFAULT_ACCOUNT, Scale } from "@/app/rebalancer/const";
import { chainConfig } from "@/const/config";

export const accountAtom = atom(DEFAULT_ACCOUNT);
export const scaleAtom = atom<Scale>(Scale.Month);
export const baseDenomAtom = atom<string>(chainConfig.defaultBaseTokenDenom);
