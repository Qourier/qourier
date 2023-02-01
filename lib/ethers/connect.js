import { ethers } from "ethers";

import cnf from "../../config/index.js";
const { rpc, factory: f, hub: h } = cnf;

const connect = (network, key, contract) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc[network]);
  const signer = new ethers.Wallet(key, provider);
  const factory = new ethers.Contract(f.contract[network], f.abi, signer);
  const hub = new ethers.Contract(contract, h.abi, signer);
  const from = signer.address;

  return { from, factory, hub };
};

export default connect;
