require("@shardlabs/starknet-hardhat-plugin");

module.exports = {
  starknet: {
    venv: "active",  // ensure cairo is installed in a python virtual environment
  },
  networks: {
    devnet: {
      url: "http://localhost:5050", // for local testing
    },
    testnet: {
      url: "https://alpha4.starknet.io",  // starknet testnet
    }
  }
};
