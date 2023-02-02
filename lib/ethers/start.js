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

  const createdEvent = async (
    task_id,
    module,
    params,
    callback,
    tasks,
    createdAt,
    event
  ) => {
    const id = task_id.toString();

    if (typeof created[id] !== "undefined") return;
    created[id] = {
      module: ethers.utils.toUtf8String(module).replace(/\0/g, ""),
      params: params
        .map(ethers.utils.toUtf8String)
        .filter((v) => !!v.replace(/\0/g, "")),
      callback,
      tasks: tasks.toString(),
      createdAt: new Date(parseInt(createdAt) * 1000),
    };

    const mod = `qourier-module-${version}-${created[id].module}`;
    const exe = await import(mod);
    const [one, two, three, four, five] = created[id].params;
    const res = await exe.default(one, two, three, four, five);

    if (res) {
      try {
        const { wait } = await hub.completeTask(
          id,
          ethers.utils.toUtf8Bytes(res.toString())
        );
        await wait(1);
      } catch (e) {}
    }

    if (tasks > 1) {
      const interval = setInterval(async () => {
        const res = await exe.default(one, two, three, four, five);
        if (!res) return;
        try {
          const { wait } = await hub.completeTask(
            id,
            ethers.utils.toUtf8Bytes(res.toString())
          );
          await wait(1);
        } catch (e) {}
      }, 1000 * 60); // 1 min
      created[id].interval = interval;
    }
  };

  const completedEvent = (
    task_id,
    result,
    qourier,
    tasks,
    completedAt,
    { transactionHash: hash }
  ) => {
    const id = task_id.toString();

    if (typeof completed[id] !== "undefined") return;
    if (typeof created[id] === "undefined") created[id] = {};
    completed[id] = {
      result: ethers.utils.toUtf8String(result).replace(/\0/g, ""),
      qourier: qourier === from ? `YOU [ ${qourier} ]` : qourier,
      tasks: tasks.toString(),
      completedAt: new Date(parseInt(completedAt) * 1000),
    };
    const type = tasks <= 0 ? "One-time task" : `${tasks} tasks left`;

    if (tasks <= 0 && created[id].interval) {
      clearInterval(created[id].interval);
    }

    const table = new Table({ style: { head: ["cyan"] } });

    table.push(
      { "Task ID": `№ ${id} [ ${hash} ]` },
      { Qourier: completed[id].qourier || "" },
      { Callback: created[id].callback || "" },
      { Module: created[id].module || "" },
      { Params: (created[id].params || []).join(" | ") },
      { Result: completed[id].result || "" },
      { Type: type || "" },
      { Created: created[id].createdAt || "" },
      { Completed: completed[id].completedAt || "" }
    );
    console.log(table.toString());
  };

  hub.on("Created", createdEvent);
  hub.on("Completed", completedEvent);
};

export default start;
