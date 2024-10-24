// this should really be in `scripts/` but have to rework imports and path handling
const { join } = require("path");
const telescope = require("@cosmology/telescope").default;
const rootDir = "./src/codegen/telescope";
const protoDirs = [join(__dirname, "./protobuf-files")];
const outPath = join(__dirname, rootDir);
console.log("INFO: Generating profotbuf types at", outPath);

telescope({
  protoDirs,
  outPath,
  options: {
    aminoEncoding: {
      enabled: true,
    },
    lcdClients: {
      enabled: false,
    },
    rpcClients: {
      enabled: false,
    },
    eslintDisable: {
      disableAll: true,
    },
    tsDisable: {
      disableAll: true,
    },
  },
});
