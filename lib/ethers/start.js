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
        .map((p) => {
          if (ethers.utils.isAddress(p)) {
            return p;
          } else {
            return ethers.utils.toUtf8String(p);
          }
        })
        .filter((v) => !!v.replace(/\0/g, "")),
      callback,
      tasks: tasks,
      createdAt: new Date(parseInt(createdAt) * 1000),
    };

    const mod = `qourier-module-${version}-${created[id].module}`;
    const exe = await import(mod);
    const [one, two, three, four, five] = created[id].params;
    const res1 = await exe.default(one, two, three, four, five);

    if (res1) {
      try {
        const { wait } = await hub.completeTask(
          id,
          ethers.utils.toUtf8Bytes(res1.toString())
        );
        await wait(1);
      } catch (e) {}
    }

    if (tasks > 1) {
      const interval = setInterval(async () => {
        const res2 = await exe.default(one, two, three, four, five);
        if (!res2) return;
        try {
          const { wait } = await hub.completeTask(
            id,
            ethers.utils.toUtf8Bytes(res2.toString())
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

    if (typeof created[id] === "undefined") {
      created[id] = {};
    }
    if (typeof completed[id] === "undefined") {
      completed[id] = {};
    }

    if (completed[id].tasks && completed[id].tasks.eq(tasks)) {
      return;
    }

    const type =
      created[id].tasks && created[id].tasks.gt(ethers.BigNumber.from("1"))
        ? `${tasks} tasks left`
        : tasks.lte(ethers.BigNumber.from("0"))
        ? "One-time task"
        : `${tasks} tasks left`;

    completed[id] = {
      result: ethers.utils.toUtf8String(result).replace(/\0/g, ""),
      qourier: qourier === from ? `YOU [ ${qourier} ]` : qourier,
      tasks,
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
      { Type: type || "" },
      { Created: created[id].createdAt || "" },
      { Completed: completed[id].completedAt || "" }
    );
    console.log(table.toString());

    if (tasks.lte(ethers.BigNumber.from("0")) && created[id].interval) {
      clearInterval(created[id].interval);
    }
  };

  hub.on("Created", createdEvent);
  hub.on("Completed", completedEvent);
};

export default start;
