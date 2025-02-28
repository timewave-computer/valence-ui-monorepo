import codegen from "@cosmwasm/ts-codegen";
const baseDir = "cosmwasm"; // needs to be updated if files move.
const inputDir = `${baseDir}/contract-schema`;
const outputDir = `dist/${baseDir}/types`;

codegen
  //@ts-ignore
  .default({
    contracts: [
      { name: "Account", dir: `${inputDir}/account/schema` },
      { name: "Rebalancer", dir: `${inputDir}/rebalancer/schema` },
      {
        name: "AuctionsManager",
        dir: `${inputDir}/auctions-manager/schema`,
      },
      {
        name: "Auction",
        dir: `${inputDir}/auction/schema`,
      },
      // ResultOfArrayOfBinaryOrErrorResponse error
      // {
      //   name: "Processor",
      //   dir: `${inputDir}/processor/schema`,
      // },
      {
        name: "ProgramRegistry",
        dir: `${inputDir}/program-registry/schema`,
      },
      {
        // "execute" excluded due to ResultOfArrayOfBinaryOrErrorResponse error
        name: "Authorizations",
        dir: `${inputDir}/authorizations/schema`,
      },
    ],
    outPath: outputDir,
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
