import { ethers } from "ethers";
import Table from "cli-table";
import gradient from "gradient-string";
import connect from "./connect.js";

const created = {};
const completed = {};
const version = "v0";
const text = {
  personal: "         This is a personal Hub!",
  connected: "       Qourier connected to the Hub!",
};

const isPersonal = async (hub, from) => {
  const info = await hub.getHub();
  const { personal } = info;
  return !/^0x0+$/.test(personal) && personal !== from;
};

const start = async (network = "", key = "0x0", address = "0x0") => {
  const { from, hub } = connect(network, key, address);
  const isP = await isPersonal(hub, from);

  if (isP) {
    console.log(gradient.instagram(text.personal), `\n`);
    return process.exit(0);
  } else {
    console.log(gradient.retro(text.connected), `\n`);
  }

  hub.on(
    "Created",
    async (task_id, module, params, callback, createdAt, event) => {
      const id = task_id.toString();

      if (typeof created[id] !== "undefined") return;
      created[id] = {
        module: ethers.utils.toUtf8String(module).replace(/\0/g, ""),
        params: params
          .map(ethers.utils.toUtf8String)
          .filter((v) => !!v.replace(/\0/g, "")),
        callback,
        createdAt: new Date(parseInt(createdAt) * 1000),
      };

      const mod = `qourier-module-${version}-${created[id].module}`;
      const [one, two, three, four, five] = created[id].params;

      const exe = await import(mod);
      const raw = await exe.default(one, two, three, four, five);
      const res = raw.toString();

      try {
        const { wait } = await hub.completeTask(
          id,
          ethers.utils.toUtf8Bytes(res)
        );
        await wait(1);
      } catch (e) {}
    }
  );

  hub.on(
    "Completed",
    (task_id, result, qourier, completedAt, { transactionHash: hash }) => {
      const id = task_id.toString();

      if (typeof completed[id] !== "undefined") return;
      if (typeof created[id] === "undefined") created[id] = {};
      completed[id] = {
        result: ethers.utils.toUtf8String(result).replace(/\0/g, ""),
        qourier: qourier === from ? `YOU [ ${qourier} ]` : qourier,
        completedAt: new Date(parseInt(completedAt) * 1000),
      };

      const table = new Table({ style: { head: ["cyan"] } });

      table.push(
        { "Task ID": `№ ${id} [ ${hash} ]` },
        { Qourier: completed[id].qourier || "" },
        { Callback: created[id].callback || "" },
        { Module: created[id].module || "" },
        { Params: (created[id].params || []).join(" | ") },
        { Result: completed[id].result || "" },
        { Created: created[id].createdAt || "" },
        { Completed: completed[id].completedAt || "" }
      );
      console.log(table.toString());
    }
  );
};

export default start;