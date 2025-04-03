import * as fs from "fs";
import axios from "axios";
import * as path from "path";
import * as toml from "toml";
import { ChainConfig, programsConfigSchema } from "./schema";
import { z } from "zod";

const WRITE_PATH = path.join(__dirname, "generated", "programs-config.ts");

const urlBase =
  "https://raw.githubusercontent.com/timewave-computer/valence-program-manager-config/refs/heads/main";
const mainnetChainsUrl = `${urlBase}/mainnet/chains.toml`;
const mainnetGeneralUrl = `${urlBase}/mainnet/general.toml`;
const testnestChainsUrl = `${urlBase}/testnet/chains.toml`;

const urls = [mainnetChainsUrl, mainnetGeneralUrl, testnestChainsUrl];

async function main() {
  console.log("Generating configuration file for Program Chain Info");
  try {
    console.log("Fetching toml files from", urls.join(", "));

    const files = await Promise.all(
      urls.map(async (url) => {
        const response = await axios.get(url);
        const data = toml.parse(response.data);
        return data;
      })
    );

    console.log("Files fetched successfully");

    const [mainnetChains, mainnetGeneral, testnestChains] = files;

    const { neutron, ...restOfMainnetChains } = mainnetChains.chains;

    const restOfChains = [
      ...Object.entries(restOfMainnetChains),
      ...Object.entries(testnestChains.chains),
    ];

    const restOfChainData: ChainConfig[] = restOfChains.map(
      ([domainName, _chain]) => {
        const chain = _chain as any;
        return {
          domainName,
          chainName: chain.name,
          chainId: chain.chain_id,
          rpc: chain.rpc,
          gasPrice: chain.gas_price,
          gasDenom: chain.gas_denom,
        };
      }
    );

    const publicProgramsConfig = {
      registry: mainnetGeneral.general.registry_addr,
      main: {
        chainId: neutron.chain_id,
        rpc: neutron.rpc,
        chainName: neutron.name,
        domainName: "neutron",
        gasPrice: neutron.gas_price,
        gasDenom: neutron.gas_denom,
      },
      chains: restOfChainData,
    };
    const validatedConfig = programsConfigSchema.parse(publicProgramsConfig);

    console.log("Config generated:", validatedConfig);
    const exportableConfig = `export const publicProgramsConfig = ${JSON.stringify(
      validatedConfig,
      null,
      2
    )};`;
    fs.writeFileSync(WRITE_PATH, exportableConfig, "utf8");

    console.log("Config written to:", WRITE_PATH);
  } catch (error) {
    console.error("ERROR: failed generative programs chain info config.");

    if (axios.isAxiosError(error)) {
      console.error(
        `Network error fetching config: ${error.message}`,
        error.config?.url
      );
    } else if (error instanceof z.ZodError) {
      console.error("Schema validation failed:", error.errors);
    } else if (error instanceof Error) {
      console.error(`Error generating public chain config: ${error.message}`);
    } else {
      console.error("Unknown error generating public chain config", error);
    }
    process.exit(1);
  }
}

main();
