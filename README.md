# 🏗 Scaffold-ETH For Auditing



# 🏄‍♂️ Quick Start

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 dapp-scaffold:

```bash
git clone https://github.com/lowk3v/dapp-scaffold -b audit
```

> install and start your 👷‍ Hardhat chain:

```bash
cd dapp-scaffold
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd dapp-scaffold
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd dapp-scaffold
yarn deploy
```

🔏 Edit your smart contract `YourContract.sol` in `contracts`

# 📚 Documentation

# 💌 P.S.

🌍 You need an RPC key for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js` with your new key.

📣 Make sure you update the `InfuraID` before you go to production. Huge thanks to [Infura](https://infura.io/) for our special account that fields 7m req/day!
