// const mongoose = require("mongoose");

// // Wallet-Schema for User's Wallet as per role:
// // Buyer: { __id, userId, userRole, balance(wallet), escrowWalletBalance }
// // Farmer: { __id, userId, userRole, balance(wallet)}
// // Creation and Updation timestamp to internal logs purpose.

// const walletSchema = new mongoose.Schema({

//     userId: {
//         type: String,
//         required: true,
//         unique: true
//     },

//     userRole: {
//         type: String,
//         required: true,
//         enum: ["Buyer", "buyer", "Farmer", "farmer"]
//     },

//     balance: {
//         type: Number,
//         default: 0
//     },

//     escrowWalletBalance: {
//         type: Number,
//         default: function () {
//             return /buyer/i.test(this.userRole) ? 0 : undefined;
//         }
//     }

// }, { timestamps: true });

// module.exports = mongoose.model("Wallet", walletSchema);

const mongoose = require("mongoose");

/*
 Wallet Schema Design Principles:
 - walletId: Internal unique identifier (non-guessable)
 - accountNumber: Public transaction reference (human readable)
 - aliasId: User-friendly ID (like UPI handle)
 - blockchainAddress: Mapping to blockchain wallet (0x...)
 - userId: Ownership mapping
 - currency: Default INR, extensible for future
 - status: Wallet lifecycle control
*/

// // Wallet-Schema for User's Wallet as per role:
// // Buyer: { __id, userId, userRole, balance(wallet), escrowWalletBalance }
// // Farmer: { __id, userId, userRole, balance(wallet)}
// // Creation and Updation timestamp to internal logs purpose.

const walletSchema = new mongoose.Schema({

    // Internal system identifier (Primary reference)
    walletId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    // Human-readable account number for transactions
    accountNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    // User-friendly alias (example: 9876543210@kup)
    aliasId: {
        type: String,
        unique: true,
        sparse: true // allows null if not provided
    },

    // Blockchain wallet address (Ethereum / Hardhat)
    blockchainAddress: {
        type: String,
        unique: true,
        sparse: true
    },

    // User ownership
    userId: {
        type: String,
        required: true,
        unique: true
    },

    userRole: {
        type: String,
        required: true,
        enum: ["Buyer", "buyer", "Farmer", "farmer"]
    },

    // Wallet balance
    balance: {
        type: Number,
        default: 0
    },

    // Buyer-specific escrow wallet
    escrowWalletBalance: {
        type: Number,
        default: function () {
            return /buyer/i.test(this.userRole) ? 0 : undefined;
        }
    },

    // Currency support (future-ready)
    currency: {
        type: String,
        default: "INR"
    },

    // Wallet status control
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCKED", "CLOSED"],
        default: "ACTIVE"
    }

}, { timestamps: true });

module.exports = mongoose.model("Wallet", walletSchema);