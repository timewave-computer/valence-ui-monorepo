import { atom } from "jotai";

export type DenomColorIndexMap = { [denom: string]: number };
export const denomColorIndexMap = atom<DenomColorIndexMap>({});
