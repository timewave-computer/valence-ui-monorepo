export const publicProgramsConfig = {
  registry:
    "neutron1d8me7p72yq95sqnq5jpk34nn4t2vdl30yff29r05250ef92mr80saqcl2f",
  chains: [
    {
      chain_id: "neutron-1",
      rpc: "https://rpc-voidara.neutron-1.neutron.org",
      name: "neutron",
      gas_price: "0.0053",
      gas_denom: "untrn",
    },
    {
      chain_id: "juno-1",
      rpc: "https://juno-rpc.polkachu.com",
      name: "juno",
      gas_price: "0.075",
      gas_denom: "ujuno",
    },
    {
      chain_id: "phoenix-1",
      rpc: "https://terra-rpc.polkachu.com",
      name: "terra",
      gas_price: "0.015",
      gas_denom: "uluna",
    },
    {
      chain_id: "pion-1",
      rpc: "https://rpc-falcron.pion-1.ntrn.tech",
      name: "neutron",
      gas_price: "0.0053",
      gas_denom: "untrn",
    },
  ],
};
