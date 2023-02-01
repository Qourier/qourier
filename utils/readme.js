import gradient from "gradient-string";
import lighthouse from "@lighthouse-web3/sdk";

import cnf from "../config/index.js";
// const { ipfs } = cnf;

const md = async (price = "0", modules = []) => {
  const md = [];

  md.push(`\`\`\`rust\n${title}\n${sub}\n\`\`\``);
  md.push(`# Network\n\n- \`Filcoin\``);
  md.push(`# Price\n\n- \`${price} FIL/task\``);
  md.push(`# Usage\n\n\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@qourier/contracts/Delivery.sol";

contract HowToUse {
    uint256 id;
    bytes result;

    address delivery = 0x0; // Address Delivery Node
    uint256 price = ${price} * 10**18;

    function newTask() public payable {
        Delivery(delivery).newTask2{ value: price }(bytes32("sum-of-numbers"), [bytes("4"), bytes("5")]);
        // newTask  - without params
        // newTask1 - [bytes("param1")]
        // newTask2 - [bytes("param1"), bytes("param2")]
        // newTask3 - [bytes("param1"), bytes("param2"), bytes("param3"), ]
        // newTask4 - [bytes("param1"), bytes("param2"), bytes("param3"), bytes("param4")]
        // newTask5 - [bytes("param1"), bytes("param2"), bytes("param3"), bytes("param4"), bytes("param5")]
    }

    function completeTask(uint256 id_, bytes memory result_) external {
        id = id_;
        result = result_;
    }
}
\`\`\``);
  md.push(
    `# Modules\n\n` +
      (Array.isArray(modules) ? modules : [modules])
        .map((m) =>
          m
            ? `- [x] <a href="https://www.npmjs.com/package/qourier-module-v0-${m}">${m}</a>`
            : ""
        )
        .join("\n")
  );

  const hash = { Hash: "Qmmmm" }; // await lighthouse.uploadText(md.join("\n"), ipfs.lighthouse);

  return hash.Hash;
};

export { md };
