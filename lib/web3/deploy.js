import Web3 from "web3";

import cnf from "../config/index.js";
const { rpc, factory: f } = cnf;

const newDelivery = async (
  network = "",
  key = "0x0",
  price = "0",
  readme = ""
) => {
  const web3 = new Web3(rpc[network].http);
  const { address: from } = web3.eth.accounts.privateKeyToAccount(key);
  const factory = new web3.eth.Contract(f.abi, f.contract[network], {
    from,
  });

  const tx = factory.methods.newDelivery(
    web3.utils.toWei(price.toString(), "ether"),
    readme ? web3.utils.asciiToHex(readme) : []
  );
  const data = tx.encodeABI();

  const to = factory.options.address;
  const gas = "55633206";
  const maxFeePerGas = web3.utils.toHex(web3.utils.toWei("5.5", "gwei"));
  const maxPriorityFeePerGas = web3.utils.toHex(
    web3.utils.toWei("5.5", "gwei")
  );
  const nonce = await web3.eth.getTransactionCount(from);

  // const chainId = await web3.eth.net.getId();
  // const gas = await tx.estimateGas();
  // console.log("gas", gas);
  // const gasPrice = await web3.eth.getGasPrice();
  // const nonce = await web3.eth.getTransactionCount(from);

  const trx = {
    from,
    to,
    data,
    gas,
    maxPriorityFeePerGas,
    maxFeePerGas,
    nonce,
  };

  console.log(trx);

  const signedTx = await web3.eth.signTransaction(trx, key);

  console.log(signedTx);

  const log = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log("log", log.logs[0]);

  return web3.eth.abi.decodeLog(
    [
      {
        indexed: false,
        internalType: "uint256",
        name: "delivery_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "delivery_address",
        type: "address",
      },
    ],
    log.logs[0].data
  );
};

export default newDelivery;
