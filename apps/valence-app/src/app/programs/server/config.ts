import { getNeutronRpc } from "@/server/rpc";
import { QueryConfig } from "@/app/programs/server";

export const getDefaultMainChainConfig = (): QueryConfig["main"] => {
  const rpcUrl = getNeutronRpc();
  return {
    chainId: "neutron-1",
    registryAddress:
      "neutron1wug8sewp6cedgkmrmvhl3lf3tulagm9hnvy8p0rppz9yjw0g4wtqvfcxh2",
    rpcUrl: "https://1fca-2601-8c-4982-6aa0-9159-995b-b8ce-3426.ngrok-free.app",
    name: "neutron",
  };
};

export const getPreferredRpcs = () => {
  return {
    "neutron-1": getNeutronRpc(),
  };
};
