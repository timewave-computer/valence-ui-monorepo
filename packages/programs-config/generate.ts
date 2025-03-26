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

const chainConfigSchema = z.object({
  chainId: z.string(),
  rpc: z.string(),
  chainName: z.string(),
  domainName: z.string(),
  gasPrice: z.string(),
  gasDenom: z.string(),
});
type ChainConfig = z.infer<typeof chainConfigSchema>;
const programsConfigSchema = z.object({
  registry: z.string(),
  main: chainConfigSchema,
  chains: z.array(chainConfigSchema),
});

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

    const { neutron, ...restOfMainnetChains } = mainnetChains.chains;
    console.log("neutron", neutron);

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
    console.log("publicProgramsConfig", publicProgramsConfig);
    const validatedConfig = programsConfigSchema.parse(publicProgramsConfig);
    const exportableConfig = `export const publicProgramsConfig = ${JSON.stringify(
      validatedConfig,
      null,
      2
    )};`;
    fs.writeFileSync(WRITE_PATH, exportableConfig, "utf8");
  } catch (error) {
    console.error("Error generating public chain config", error);
  }
}

fetchAndParseToml();
