import prompts from "prompts";
import argv from "minimist";

import {
  commands,
  string,
  logo,
  parseArgv,
  deployTab,
  startTab,
} from "./utils/cli.js";

import {
  deploy as deployHub,
  start as startQourier,
  module as requiredModules,
} from "./lib/ethers/index.js";

let a = parseArgv(argv(process.argv.slice(2), { string }));
prompts.override(a);

(async () => {
  console.log(logo);

  const first = await prompts(commands.script);
  if (!first || !Object.keys(first).length) return;
  const last = await prompts(commands[first.script]);
  let address = last.address || "";

  if (first.script === "deploy") {
    if (deployTab(a)) console.log("");
    address = await deployHub(
      first.network,
      first.key,
      last.price,
      last.module,
      last.personal
    );
  }

  if (first.script === "start" || last.start) {
    if (startTab(a)) console.log("");
    await requiredModules(first.network, first.key, address);
    await startQourier(first.network, first.key, address);
  } else {
    process.exit(0);
  }
})();
