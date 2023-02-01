import Web3 from "web3";
import Table from "cli-table";
import gradient from "gradient-string";

import cnf from "../config/index.js";
const { rpc, delivery: d } = cnf;

const completeTask = async (network = "", key = "0x0", address = "0x0") => {
  const web3 = new Web3(rpc[network].ws);
  const { address: from } = web3.eth.accounts.privateKeyToAccount(key);
  const delivery = new web3.eth.Contract(d.abi, address, { from });

  // const info = await delivery.methods.getDelivery().call();
  // const { personal } = info;

  // if (!/^0x0+$/.test(personal) && personal !== from) {
  //   console.log(
  //     gradient.instagram(`       This is a personal delivery node!`),
  //     `\n`
  //   );
  //   return process.exit(0);
  // } else {
  //   console.log(gradient.retro(`           Delivery node started ...`), `\n`);
  // }

  console.log(gradient.retro(`           Delivery node started ...`), `\n`);

  delivery.events
    .NewTask()
    .on("data", async function (event) {
      const { task_id: id } = event.returnValues;

      const task = await delivery.methods.getTask(id).call();
      const { module, params, result } = task;

      if (!web3.utils.hexToString(result)) {
        const m = web3.utils.hexToString(module);
        const [one, two, three, four, five] = params.map(
          web3.utils.hexToString
        );

        const ex = await import(`qourier-module-v0-${m}`);
        const res = await ex.default(one, two, three, four, five);

        const tx = delivery.methods.completeTask(
          id,
          web3.utils.asciiToHex(res + "")
        );

        const chainId = await web3.eth.net.getId();
        const gas = await tx.estimateGas({ from });
        const gasPrice = await web3.eth.getGasPrice();
        const maxPriorityFeePerGas = await web3.eth.getMaxPriorityFeePerGas();
        const data = tx.encodeABI();
        const nonce = await web3.eth.getTransactionCount(from);

        const signedTx = await web3.eth.accounts.signTransaction(
          {
            to: delivery.options.address,
            data,
            gas,
            maxPriorityFeePerGas,
            // gasPrice,
            nonce,
            chainId,
          },
          key
        );

        const { result: preResult } = await delivery.methods.getTask(id).call();

        let hash = "";
        if (!web3.utils.hexToString(preResult)) {
          try {
            const receipt = await web3.eth.sendSignedTransaction(
              signedTx.rawTransaction
            );
            hash = receipt.transactionHash;
          } catch (e) {}
        }

        const {
          result: postResult,
          qourier,
          createAt,
          completeAt,
        } = await delivery.methods.getTask(id).call();

        const table = new Table({ style: { head: ["cyan"] } });
        table.push(
          { "Task ID": hash ? `№ ${id} [ ${hash} ]` : `№ ${id}` },
          {
            Qourier: `${
              from === qourier ? `[ YOU ] ${qourier}` : `${qourier}`
            }`,
          },
          { Module: `qourier-module-v0-${m}` },
          {
            Params: [one, two, three, four, five].filter(Boolean).join(` | `),
          },
          { Result: web3.utils.hexToString(postResult) },
          { Create: new Date(parseInt(createAt) * 1000) },
          { Complete: new Date(parseInt(completeAt) * 1000) }
        );

        console.log(table.toString());
      }
    })
    .on("changed", function (event) {
      console.log("changed", event);
    })
    .on("error", function (error, receipt) {
      console.log("error", error, receipt);
    });
};

export default completeTask;
