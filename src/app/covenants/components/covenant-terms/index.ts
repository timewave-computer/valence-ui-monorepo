import { ReactNode } from "react";
import { Field } from "@/app/covenants/components/form";
import { CovenantType } from "@/app/covenants/const";

import { swapLp } from "./swapLp";
import { onePartyPol } from "./onePartyPol";
import { twoPartyPol } from "./twoPartyPol";

export type CovenantFields = {
  parties: 1 | 2;
  each: Field[];
  both?: Field[];
  makeContractText: (
    aData: Record<string, any>,
    bData: Record<string, any>,
    bothData: Record<string, any>,
  ) => ReactNode;
  makeInstantiateMsg: (
    aData: Record<string, any>,
    bData: Record<string, any>,
    bothData: Record<string, any>,
  ) => Record<string, any>;
};

export const COVENANT_TYPES: Record<CovenantType, CovenantFields> = {
  swapLp,
  onePartyPol,
  twoPartyPol,
};
