# Qourier

Infrastructural protocol for combining data between WEB2 ⇠⇢ WEB3

## Install

```bash
npx qourier
# or
npm i -g qourier
```

# Deploy

```bash
PRIVATE_KEY="key"

SUPPORTED_MODULE1="read-ipfs"
SUPPORTED_MODULE2="random-org"

npm i -g \
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
PRIVATE_KEY="key"
ADDRESS_HUB="0x0"

qourier \
  --network filecoin \
  --script start \
  --key $PRIVATE_KEY \
  --address $ADDRESS_HUB
```

## Example

- **PushProtocol**
  - <a href="https://www.npmjs.com/package/qourier-module-v0-push-protocol">qourier-module-v0-push-protocol</a>
  - <a href="https://github.com/Qourier/contracts/blob/main/src/example/PushProtocol.sol">PushProtocol.sol</a>
- **LighthouseWeb3**
  - <a href="https://www.npmjs.com/package/qourier-module-v0-lighthouse-web3">qourier-module-v0-lighthouse-web3</a>
  - <a href="https://github.com/Qourier/contracts/blob/main/src/example/LighthouseWeb3.sol">LighthouseWeb3.sol</a>
- **SumOfNumbers**
  - <a href="https://www.npmjs.com/package/qourier-module-v0-sum-of-numbers">qourier-module-v0-sum-of-numbers</a>
  - <a href="https://github.com/Qourier/contracts/blob/main/src/example/SumOfNumbers.sol">SumOfNumbers.sol</a>
- **TickerSymbol**
  - <a href="https://www.npmjs.com/package/qourier-module-v0-sum-of-numbers">qourier-module-v0-sum-of-numbers</a>
  - <a href="https://github.com/Qourier/contracts/blob/main/src/example/TickerSymbol.sol">TickerSymbol.sol</a>

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
