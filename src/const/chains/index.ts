import { NEUTRON_CHAIN } from "@/const/chains/neutron";
import { assets } from "chain-registry";

let DEFAULT_CHAIN = NEUTRON_CHAIN;

// use assets from neutron, even if we are using testnet below
const ASSETS = assets.filter((a) => a.chain_name === DEFAULT_CHAIN.chain_name);

// if (
//   process.env.NODE_ENV === "development" &&
//   process.env.NEXT_PUBLIC_CHAIN_ID === PION_CHAIN.chain_id
// ) {
//   DEFAULT_CHAIN = PION_CHAIN;
// }

export { DEFAULT_CHAIN, ASSETS };
