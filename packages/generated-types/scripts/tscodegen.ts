import codegen from "@cosmwasm/ts-codegen";

codegen
  //@ts-ignore
  .default({
    contracts: [
      { name: "Account", dir: "contract-schema/account/schema" },
      { name: "Rebalancer", dir: "contract-schema/rebalancer/schema" },
      {
        name: "AuctionsManager",
        dir: "contract-schema/auctions-manager/schema",
      },
      {
        name: "Auction",
        dir: "contract-schema/auction/schema",
      },
      {
        name: "ProgramConfigManager",
        dir: "contract-schema/program-config-manager/schema",
      },
    ],
    outPath: "types",
    // options are completely optional ;)
    options: {
      bundle: {
        bundleFile: "index.ts",
        scope: "contracts",
      },
      types: {
        enabled: true,
      },
      client: {
        enabled: true,
      },
      reactQuery: {
        enabled: false,
        optionalClient: true,
        version: "v4",
        mutations: true,
        queryKeys: true,
        queryFactory: true,
      },
      recoil: {
        enabled: false,
      },
      messageComposer: {
        enabled: false,
      },
      messageBuilder: {
        enabled: false,
      },
      useContractsHook: {
        enabled: false,
      },
    },
  })
  .then(() => {
    console.log("✨ all done!");
  });
