import { atom } from "jotai";

export type DenomColorIndexMap = { [denom: string]: number };
export const denomColorMapAtom = atom<DenomColorIndexMap>({});
