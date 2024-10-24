import { DropdownOption } from "@/components";

export enum ContractDisplayMode {
  Contract = "contract",
  JSON = "json",
}
export enum CovenantTypeSelector {
  Swap = "swap",
  Pol = "pol",
}
export enum CovenantType {
  SwapLp = "swapLp",
  OnePartyPol = "onePartyPol",
  TwoPartyPol = "twoPartyPol",
}

export const TYPE_OPTIONS: DropdownOption<CovenantTypeSelector>[] = [
  {
    label: "Swap",
    value: CovenantTypeSelector.Swap,
  },
  {
    label: "Provide Liquidity",
    value: CovenantTypeSelector.Pol,
  },
];

export const POL_TYPE_PARTIES_OPTIONS: DropdownOption<"1" | "2">[] = [
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
];

export const CHAIN_ID_OPTIONS: DropdownOption<string>[] = [
  {
    label: "Cosmos Hub",
    value: "cosmoshub-4",
  },
  {
    label: "Neutron",
    value: "neutron-1",
  },
  {
    label: "Osmosis",
    value: "osmosis-1",
  },
];
