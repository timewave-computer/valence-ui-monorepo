import * as fs from "fs";
import axios from "axios";
import * as path from "path";
import * as toml from "toml";

const mainnetChainsUrl =
  "https://raw.githubusercontent.com/timewave-computer/valence-program-manager-config/refs/heads/main/mainnet/chains.toml";
const mainnetGeneralUrl =
  "https://raw.githubusercontent.com/timewave-computer/valence-program-manager-config/refs/heads/main/mainnet/general.toml";
const testnestChainsUrl =
  "https://raw.githubusercontent.com/timewave-computer/valence-program-manager-config/refs/heads/main/testnet/chains.toml";
const testnetGeneralUrl =
  "https://raw.githubusercontent.com/timewave-computer/valence-program-manager-config/refs/heads/main/testnet/general.toml";

const urls = [
  mainnetChainsUrl,
  mainnetGeneralUrl,
  testnestChainsUrl,
  testnetGeneralUrl,
];
async function fetchAndParseToml() {
  try {
    const files = await Promise.all(
      urls.map(async (url) => {
        const response = await axios.get(url);
        const data = toml.parse(response.data);
        return data;
      })
    );
    console.log("FILES", files);
    const [mainnetChains, mainnetGeneral, testnestChains, testnetGeneral] =
      files;
    console.log("mainnetChains", mainnetChains);
    console.log("mainnetGeneral", mainnetGeneral);
    console.log("testnestChains", testnestChains);
    console.log("testnetGeneral", testnetGeneral);

    // export object with rpc, chain IDs, chain names, etc

    // what is needed?
    // fetch all supported chain IDS
    // with these chain IDs, export graz chain data (ids, RPCs, etc)

    // // Generate files from the parsed data
    // for (const chain in data.chains) {
    //   const chainData = data.chains[chain];
    //   const filePath = path.join(__dirname, `${chain}.json`);
    //   fs.writeFileSync(filePath, JSON.stringify(chainData, null, 2));
    //   console.log(`Generated file: ${filePath}`);
    // }
  } catch (error) {
    console.error("Error fetching or parsing the TOML file:", error);
  }
}

fetchAndParseToml();
