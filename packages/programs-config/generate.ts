import * as fs from "fs";
import axios from "axios";
import * as path from "path";
import * as toml from "toml";
import { z } from "zod";

const WRITE_PATH = path.join(__dirname, "generated", "programs-config.ts");
const mainnetChainsUrl =
  "https://raw.githubusercontent.com/timewave-computer/valence-program-manager-config/refs/heads/main/mainnet/chains.toml";
const mainnetGeneralUrl =
  "https://raw.githubusercontent.com/timewave-computer/valence-program-manager-config/refs/heads/main/mainnet/general.toml";
const testnestChainsUrl =
  "https://raw.githubusercontent.com/timewave-computer/valence-program-manager-config/refs/heads/main/testnet/chains.toml";

const urls = [mainnetChainsUrl, mainnetGeneralUrl, testnestChainsUrl];

async function fetchAndParseToml() {
  try {
    const files = await Promise.all(
      urls.map(async (url) => {
        const response = await axios.get(url);
        const data = toml.parse(response.data);
        return data;
      })
    );
    const [mainnetChains, mainnetGeneral, testnestChains] = files;

    const publicProgramsConfig = {
      registry: mainnetGeneral.general.registry_addr,
      chains: [
        ...Object.values(mainnetChains.chains),
        ...Object.values(testnestChains.chains),
      ],
    };
    const validatedConfig = configSchema.parse(publicProgramsConfig);
    const exportableConfig = `export const publicProgramsConfig = ${JSON.stringify(
      validatedConfig,
      null,
      2
    )};`;
    fs.writeFileSync(WRITE_PATH, exportableConfig, "utf8");
  } catch (error) {
    console.error("Error fetching or parsing the TOML file:", error);
  }
}

fetchAndParseToml();

const configSchema = z.object({
  registry: z.string(),
  chains: z.array(
    z.object({
      chain_id: z.string(),
      rpc: z.string(),
      name: z.string(),
      gas_price: z.string(),
      gas_denom: z.string(),
    })
  ),
});
