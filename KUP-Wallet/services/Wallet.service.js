// const Wallet = require("../models/Wallet.model");

// // Wallet Management for User's Wallet as per role:
// // Buyer: Auto-create as logs to system, add, view wallet
// // Farmer: Auto-create as logs to system view-only access to wallet cannot add funds to wallet but can withdraw to actual banks as per rais of request: withdraw

// // Auto-create as logs to system. Common role: Buyer, Farmer
// const createWallet = async (userId, userRole) => {
//     let walletForUser = {};

//     if (userRole === "Buyer" || userRole === "buyer") {
//         walletForUser = {
//             userId,
//             userRole,
//             balance: 0,
//             escrowBalance: 0
//         }
//     } else if (userRole === "Farmer" || userRole === "farmer") {
//         walletForUser = {
//             userId,
//             userRole,
//             balance: 0,
//         }
//     }
//     const wallet = new Wallet(walletForUser);
//     return await wallet.save();
// };


// // Common role: Buyer, Farmer
// const getWallet = async (userId) => {
//     return await Wallet.findOne({ userId });
// };


// // Only rights to add balance to wallet for authorized to only Buyer.
// const addBalance = async (userId, amount) => {
//     const wallet = await Wallet.findOne({ userId });
//     wallet.balance += amount;
//     return await wallet.save();
// };

// module.exports = { createWallet, getWallet, addBalance };


const Wallet = require("../models/Wallet.model");
const crypto = require("crypto");
const {
    generateWalletId,
    generateAccountNumber,
    generateAliasId,
    generateBlockchainAddress
} = require("../utilities/IDGenerator");

//  Create Wallet
const createWallet = async (userId, userRole, mobile = null) => {

    // Prevent duplicate wallet
    const existing = await Wallet.findOne({ userId });
    if (existing) return existing;

    const walletData = {
        walletId: generateWalletId(),
        accountNumber: generateAccountNumber(),
        aliasId: generateAliasId(mobile),
        blockchainAddress: generateBlockchainAddress(),
        userId,
        userRole,
        currency: "INR",
        status: "ACTIVE"
    };

    if (/buyer/i.test(userRole)) {
        walletData.balance = 0;
        walletData.escrowWalletBalance = 0;
    } else {
        walletData.balance = 0;
    }

    const wallet = new Wallet(walletData);
    return await wallet.save();
};

// Get User Wallet
const getWallet = async (userId) => {
    return await Wallet.findOne({ userId });
};


// Add Balance (Buyer only - enforce rule)

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

const addBalance = async (userId, amount) => {
    const validAmount = validateAmount(amount);

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
        throw new Error("Wallet not found");
    }

    wallet.balance += validAmount;

    return await wallet.save();
};

module.exports = {
    createWallet,
    getWallet,
    addBalance
};