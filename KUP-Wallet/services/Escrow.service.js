// const Escrow = require("../models/Escrow.model");
// const Wallet = require("../models/Wallet.model");

// // Functionality to Lock the funds to Wallet
// const lockFunds = async (buyerId, farmerId, amount, orderId) => {

//   //Before locking funds to EscrowWallet, check that buyer's wallet exists and has sufficient balance to lock the funds.
//   const wallet = await Wallet.findOne({
//     userId: buyerId,
//     userRole: { $in: ["Buyer", "buyer"] }
//   });

//   //Step1: If wallet exists 
//   if (!wallet) {
//     throw new Error("Wallet not found for buyer");
//   }

//   //Step2: Check the balance in wallet that must be greater that amount of order .
//   if (wallet.balance < amount) {
//     throw new Error("Insufficient funds");
//   }

//   // Step3: If all above checks are passed then lock the funds to EscrowWallet and update the balance in buyer's wallet  
//   wallet.balance -= amount;
//   wallet.escrowWalletBalance += amount;

//   await wallet.save();

//   // Step4: Create and save the record in Escrow database with status LOCKED as new
//   const escrow = new Escrow({
//     orderId,
//     buyerId,
//     farmerId,
//     escrowBalance: amount,
//     walletStatus: "LOCKED"
//   });

//   await escrow.save();
//   return escrow;
// };


// // Functionality to Release the funds to seller after order completion and status updation in Escrow-databse
// const releaseFunds = async (orderId, buyerId, farmerId, amount) => {

//   // step1: before release funds check that respected orderId exists in escrowWallet
//   const escrow = await Escrow.findOne({ orderId });

//   if (!escrow) {
//     throw new Error("No record found for orderId: ", orderId);
//   }

//   // step2: Next check is both users: farmer and buyers are associated with that orderId
//   const farmerWallet = await Wallet.findOne({ userId: escrow.farmerId });
//   const buyerWallet = await Wallet.findOne({ userId: escrow.buyerId });

//   if (!(buyerWallet && farmerWallet)) {
//     throw new Error("No buyer and farmer found with this OrderId.")
//   }

//   // Step3: Check EscrowWallet has sufficient balance before releases
//   if ((buyerWallet.escrowWalletBalance && escrow.escrowBalance) < amount) {
//     throw new Error("Insuficient balance in Escro-Wallet to release the fund, Please check and add sufficient balance to Escrow-Wallet.");
//   }

//   //Step4: If all above checks are passed then release the funds to farmer and update the EscrowWallet balance and Buyer's EscrowWalletBalance and status in database.
//   buyerWallet.escrowWalletBalance -= amount;
//   escrow.escrowBalance -= amount;

//   farmerWallet.balance += amount;

//   await buyerWallet.save();
//   await farmerWallet.save();

//   escrow.walletStatus = "RELEASED";
//   await escrow.save();

//   return escrow;
// };



// //TODO: Under Developement, not yet added and tested.

// // Functionality to Return the funds to buyer if order cancels by buyer, but 15-20% deduction will be applied and credit to farmer's wallet as compensation for order cancellation. And status updation in Escrow-databse
// const returnFunds = async (orderId, buyerId, farmerId, amount) => {

//   const walletFarmer = await Wallet.findOne({ userId: escrow.farmerId });
//   const walletBuyer = await Wallet.findOne({ userId: escrow.buyerId });

//   // step1: before refuning funds check that respected orderId exists in escrowWallet
//   const escrow = await Escrow.findOne({ orderId });

//   if (!escrow) {
//     throw new Error("No record found for orderId: ", orderId);
//   }

//   // step2: Next check both users: farmer and buyers are associated with that orderId
//   const farmerWallet = await Escrow.findOne({ userId: escrow.farmerId });
//   const buyerWallet = await Escrow.findOne({ userId: escrow.buyerId });

//   if (!(buyerWallet && farmerWallet)) {
//     throw new Error("No buyer and farmer found with this OrderId.")
//   }

//   // Step3: Check EscrowWallet has sufficient balance before return the fund to buyer
//   if ((escrow.escrowBalance) < amount) {
//     throw new Error("Insuficient balance in Escro-Wallet to return the fund, Please check and add sufficient balance to Escrow-Wallet.");
//   }

//   //Step4: If all above checks are passed then return the funds to buyer and update the EscrowWallet balance and Buyer's EscrowWalletBalance and status in database.
//   walletBuyer.escrowWalletBalance -= amount;
//   escrow.escrowBalance -= amount;

//   buyerWallet.balance += amount;

//   await buyerWallet.save();

//   escrow.walletStatus = "REFUNDED";
//   await escrow.save();

//   return escrow;
// }

// module.exports = { lockFunds, releaseFunds, returnFunds };

const Escrow = require("../models/Escrow.model");
const Wallet = require("../models/Wallet.model");

// Amount Validation
const validateAmount = (amount) => {
  if (amount === undefined || amount === null) {
    throw new Error("Amount is required");
  }

  const parsedAmount = Number(amount);

  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new Error("Invalid amount");
  }

  return parsedAmount;
};


// Lock Funds
const lockFunds = async (buyerId, farmerId, amount, orderId) => {

  const validAmount = validateAmount(amount);

  const buyerWallet = await Wallet.findOne({
    userId: buyerId,
    userRole: { $in: ["Buyer", "buyer"] }
  });

  const farmerWallet = await Wallet.findOne({
    userId: farmerId,
    userRole: { $in: ["Farmer", "farmer"] }
  });

  if (!buyerWallet) throw new Error("Buyer wallet not found");
  if (!farmerWallet) throw new Error("Farmer wallet not found");

  if (buyerWallet.balance < validAmount) {
    throw new Error("Insufficient balance");
  }

  // Deduct and lock
  buyerWallet.balance -= validAmount;
  buyerWallet.escrowWalletBalance += validAmount;

  await buyerWallet.save();

  const escrow = new Escrow({
    orderId,
    buyerId,
    farmerId,
    buyerWalletId: buyerWallet.walletId,
    farmerWalletId: farmerWallet.walletId,
    escrowBalance: amount,
    currency: buyerWallet.currency,
    walletStatus: "LOCKED"
  });

  await escrow.save();
  return escrow;
};

// Release Funds
const releaseFunds = async (orderId) => {

  const escrow = await Escrow.findOne({ orderId });

  if (!escrow) {
    throw new Error("Escrow not found");
  }

  if (escrow.walletStatus !== "LOCKED") {
    throw new Error("Escrow already processed");
  }

  const buyerWallet = await Wallet.findOne({ walletId: escrow.buyerWalletId });
  const farmerWallet = await Wallet.findOne({ walletId: escrow.farmerWalletId });

  if (!(buyerWallet && farmerWallet)) {
    throw new Error("Wallets not found");
  }

  const amount = escrow.escrowBalance;

  if (buyerWallet.escrowWalletBalance < amount) {
    throw new Error("Insufficient escrow balance");
  }

  // Transfer
  buyerWallet.escrowWalletBalance -= amount;
  farmerWallet.balance += amount;

  await buyerWallet.save();
  await farmerWallet.save();

  escrow.walletStatus = "RELEASED";
  escrow.escrowBalance = 0;

  await escrow.save();

  return escrow;
};


// Return Funds (Refund with deduction logic placeholder)
const returnFunds = async (orderId) => {

  const escrow = await Escrow.findOne({ orderId });

  if (!escrow) {
    throw new Error("Escrow not found");
  }

  if (escrow.walletStatus !== "LOCKED") {
    throw new Error("Escrow already processed");
  }

  const buyerWallet = await Wallet.findOne({ walletId: escrow.buyerWalletId });
  const farmerWallet = await Wallet.findOne({ walletId: escrow.farmerWalletId });

  if (!(buyerWallet && farmerWallet)) {
    throw new Error("Wallets not found");
  }

  const amount = escrow.escrowBalance;

  if (buyerWallet.escrowWalletBalance < amount) {
    throw new Error("Insufficient escrow balance");
  }

  // Optional: deduction logic (e.g., 10%)
  const deduction = amount * 0.1;
  const refundAmount = amount - deduction;

  buyerWallet.escrowWalletBalance -= amount;
  buyerWallet.balance += refundAmount;

  farmerWallet.balance += deduction;

  await buyerWallet.save();
  await farmerWallet.save();

  escrow.walletStatus = "REFUNDED";
  escrow.escrowBalance = 0;

  await escrow.save();

  return escrow;
};

module.exports = { lockFunds, releaseFunds, returnFunds };