import { ethers } from "ethers";
import Table from "cli-table";
import connect from "./connect.js";

const deployed = new Set();

const deploy = async (
  network = "",
  key = "0x0",
  price = "0",
  modules = [],
  personal = false
) => {
  return new Promise(async (resolve, reject) => {
    const { factory } = connect(network, key, 0x0);

    const { wait, hash: hashOffChain } = await factory.newHub(
      ethers.utils.parseUnits(price.toString(), 18),
      (Array.isArray(modules) ? modules : [modules])
        .concat(["", "", "", "", "", "", "", "", "", ""])
        .slice(0, 10)
        .map(ethers.utils.formatBytes32String),
      personal
    );

    factory.on(
      "NewHub",
      (
        hub_id,
        address,
        personal,
        price,
        modules,
        { transactionHash: hash }
      ) => {
        if (deployed.has(hash)) return;
        deployed.add(hash);

        if (hashOffChain === hash) {
          const table = new Table({ style: { head: ["cyan"] } });

          table.push(
            { "Hub ID": `№ ${hub_id} [ ${hash} ]` },
            { Address: address },
            {
              Personal:
                personal === ethers.constants.AddressZero
                  ? `No`
                  : `Yes [ ${personal} ]`,
            },
            { Price: ethers.utils.formatEther(price) },
            {
              Modules: modules
                .map(ethers.utils.parseBytes32String)
                .filter((v) => !!v.trim())
                .join(" | "),
            }
          );

          console.log(table.toString());

          return resolve(address);
        }
      }
    );

    await wait(1);
  });
};

export default deploy;
