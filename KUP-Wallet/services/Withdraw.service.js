// const Withdraw = require("../models/Withdraw.model");
// const wallet = require('../models/Wallet.model');

// //  Money-Withdrawl: To withdraw money from Farmer's own wallet and transfer to his respected bank ( Post-Settlement functionality) as per requested by farmer or raise request to transfer money from his wallet.

// exports.requestWithdraw = async (userId, userRole, amount) => {

//     const farmerWallet = await wallet.findOne({
//         userId: userId,
//         userRole: { $in: ["Farmer", "farmer"] }
//     });

//     if (!farmerWallet) {
//         throw new Error("Wallet not found for user: Farmer");
//     }

//     if (farmerWallet.balance < amount) {
//         throw new Error("Insufficient balance for withdrawl, Please check balance.");

//     } else {
//         farmerWallet.balance -= amount  //Deduct the amount from farmer's wallet balance
//         await farmerWallet.save();
//     }

//     const withdraw = new Withdraw({
//         userId,
//         amount,
//         status: "REQUESTED"
//     });

//     await withdraw.save()
//     return withdraw;
// };

const Withdraw = require("../models/Withdraw.model");
const Wallet = require('../models/Wallet.model');

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

// Request Withdraw (Farmer only)
const requestWithdraw = async (userId, amount) => {

    const validAmount = validateAmount(amount);

    const farmerWallet = await Wallet.findOne({
        userId,
        userRole: { $in: ["Farmer", "farmer"] }
    });

    if (!farmerWallet) {
        throw new Error("Farmer wallet not found");
    }

    if (farmerWallet.status !== "ACTIVE") {
        throw new Error("Wallet is not active");
    }

    if (validAmount <= 0) {
        throw new Error("Invalid withdrawal amount");
    }

    if (farmerWallet.balance < validAmount) {
        throw new Error("Insufficient balance");
    }

    // Deduct balance (later this should be moved to ledger system)
    farmerWallet.balance -= validAmount;
    await farmerWallet.save();

    const withdraw = new Withdraw({
        userId,
        walletId: farmerWallet.walletId,
        accountNumber: farmerWallet.accountNumber,
        amount,
        currency: farmerWallet.currency,
        status: "REQUESTED"
    });

    await withdraw.save();

    return withdraw;
};

module.exports = { requestWithdraw };