import { SupportedChainId } from "@/const";

export const getNeutronRpc = () => {};
export let NEUTRON_RPC = process.env.NEUTRON_RPC_URL;

if (typeof window === "undefined") {
  // This code runs only in the backend (Node.js environment)
  if (!NEUTRON_RPC) {
    throw new Error("Please provide NEUTRON_RPC_URL");
  }
}

export const RpcConfig: Record<SupportedChainId, string> = {
  "neutron-1": NEUTRON_RPC!,
  "pion-1": "https://rpc-falcron.pion-1.ntrn.tech",
};
