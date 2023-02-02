import { ethers } from "ethers";
import gradient from "gradient-string";
import connect from "./connect.js";

const version = "v0";

const module = async (network, key, address) => {
  const { factory } = connect(network, key, address);

  const { modules } = await factory.getHubByAddress(address);
  const m = modules.map(ethers.utils.parseBytes32String).filter(Boolean);
  const i = [];
  const result = await Promise.all(
    m.map(async (m) => {
      try {
        await import(`qourier-module-${version}-${m}`);
        return true;
      } catch (e) {
        i.push(`qourier-module-${version}-${m}`);
        return false;
      }
    })
  );
  if (result.filter(Boolean).length !== m.length) {
    console.log(gradient.vice("       Install the required modules:"), `\n`);
    console.log(gradient.fruit(`npm i -g ${i.join(" ")}`), `\n`);
    return process.exit(0);
  }
  Promise.resolve();
};

export default module;
