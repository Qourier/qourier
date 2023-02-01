# Qourier

Infrastructural protocol for combining data between WEB2 ⇠⇢ WEB3

## Install

```bash
npx qourier
# or
yarn global add qourier
```

# Deploy

```bash
SUPPORTED_MODULE1="read-ipfs"
SUPPORTED_MODULE2="random-org"

mkdir qourier && cd qourier
npm i \
  qourier-module-v0-$SUPPORTED_MODULE1 \
  qourier-module-v0-$SUPPORTED_MODULE2

qourier \
  --network filecoin \
  --script deploy \
  --key $PRIVATE_KEY \
  --price 0.1 \
  --module $SUPPORTED_MODULE1 \
  --module $SUPPORTED_MODULE2 \
  --personal false \
  --start true
```

# Start

```bash
qourier \
  --network filecoin \
  --script start \
  --key $PRIVATE_KEY \
  --address $ADDRESS_HUB
```

## Example

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@qourier/contracts/Hub.sol";

contract HowToUse {
    address public hub;
    uint256 public price;

    uint256 private id;
    bytes private result; // bytes

    constructor(address hub_, uint256 price_) {
        hub = hub_;
        price = price_;
    }

    function createTask() public payable {
        Hub(hub).createTask2{ value: price }(bytes32("sum-of-numbers"), [bytes("3"), bytes("4")]);
        // createTask  - without params
        // createTask1 - [bytes("param1")]
        // createTask2 - [bytes("param1"), bytes("param2")]
        // createTask3 - [bytes("param1"), bytes("param2"), bytes("param3"), ]
        // createTask4 - [bytes("param1"), bytes("param2"), bytes("param3"), bytes("param4")]
        // createTask5 - [bytes("param1"), bytes("param2"), bytes("param3"), bytes("param4"), bytes("param5")]
    }

    function completeTask(uint256 id_, bytes memory result_) external {
        id = id_;
        result = result_;
    }

    function getTask() public view returns(uint256, uint256) {
        return (id, result);
    }
}
```

## TODO

- [ ] Complaints system
- [ ] Random courier assignment
- [ ] Acceptance of ERC20 tokens
- [ ] Type conversion
- [ ] Qourier ping
- [ ] Preinstallation of packages
- [ ] Restriction on module execution
- [ ] Client on Go / Rust / Python

---
