// const mongoose = require('mongoose');

// // The Schema for Escrow-Wallet : Which central authorized money holder in between two parties

// const escrowSchema = new mongoose.Schema({
//     orderId: { type: String, required: true },   // ex. ord100320262017
//     buyerId: { type: String, required: true },   // ex. buyer-id
//     farmerId: { type: String, required: true },  // ex. farmer-id
//     escrowBalance: { type: Number, required: true },    // ex. Qty * perPrice
//     walletStatus: { type: String, enum: ["LOCKED", "RELEASED", "REFUNDED"] }   // ex. EscrowWallet status

// }, { timestamps: true });

// module.exports = mongoose.model("Escrow", escrowSchema);




const mongoose = require('mongoose');

/*
 Escrow Schema:
 Represents locked funds between buyer and farmer for an order.
*/

const escrowSchema = new mongoose.Schema({

    orderId: {
        type: String,
        required: true,
        unique: true
    },

    buyerId: {
        type: String,
        required: true
    },

    farmerId: {
        type: String,
        required: true
    },

    // Wallet references (important for system integrity)
    buyerWalletId: {
        type: String,
        required: true
    },

    farmerWalletId: {
        type: String,
        required: true
    },

    // Locked amount
    escrowBalance: {
        type: Number,
        required: true
    },

    // Currency alignment with wallet
    currency: {
        type: String,
        default: "INR"
    },

    // Escrow lifecycle status
    walletStatus: {
        type: String,
        enum: ["LOCKED", "RELEASED", "REFUNDED"],
        default: "LOCKED"
    }

}, { timestamps: true });

module.exports = mongoose.model("Escrow", escrowSchema);