import { atom } from "jotai";
import { DEFAULT_ACCOUNT, Scale } from "@/app/rebalancer/const";

export const accountAtom = atom(DEFAULT_ACCOUNT);
export const scaleAtom = atom<Scale>(Scale.Month);
