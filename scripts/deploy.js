const hre = require("hardhat");

async function main() {
  console.log("Deployment...\n");

  // 1. Deploy TradeRegistry
  const TradeRegistry = await hre.ethers.getContractFactory("TradeRegistry");
  const trade = await TradeRegistry.deploy();
  await trade.waitForDeployment();
  const tradeAddress = await trade.getAddress();
  console.log(`TradeRegistry deployed to: ${tradeAddress}`);

  // 2. Deploy EscrowPayment
  const EscrowPayment = await hre.ethers.getContractFactory("EscrowPayment");
  const escrow = await EscrowPayment.deploy();
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log(`EscrowPayment deployed to: ${escrowAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});