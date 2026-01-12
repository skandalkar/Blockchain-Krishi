const hre = require("hardhat");

async function main() {
  const TradeRegistry = await hre.ethers.getContractFactory("TradeRegistry");
  const trade = await TradeRegistry.deploy();
  await trade.waitForDeployment();

  console.log(`TradeRegistry deployed to: ${await trade.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});