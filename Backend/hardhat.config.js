require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({path:'.env'});

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    scrollsepolia: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
