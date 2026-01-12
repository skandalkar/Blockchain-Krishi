/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
};

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19", // Change this to match the version inside your .sol files
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};