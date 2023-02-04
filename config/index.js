import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { join, dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const f = JSON.parse(
  readFileSync(join(__dirname, "..", "abi", "factory.json"), "utf8")
);
const h = JSON.parse(
  readFileSync(join(__dirname, "..", "abi", "hub.json"), "utf8")
);

export default {
  rpc: {
    localhost: "http://127.0.0.1:8545",
    filecoin: "https://api.hyperspace.node.glif.io/rpc/v1",
  },
  factory: {
    abi: f,
    contract: {
      localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      filecoin: "0x50B72Baf990Ed475cfeC538b2fa525F00a8A4992",
    },
  },
  hub: {
    abi: h,
  },
};
