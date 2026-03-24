// const mongoose = require('mongoose');

// //  Money-Withdrawl Schema to withdraw money from Farmer's own wallet and transfer to his respected bank ( Post-Settlement functionality)
// const withdrawSchema = new mongoose.Schema({
//     userId: String,
//     amount: Number,
//     status: {
//         type: String,
//         enum: ["REQUESTED", "APPROVED", "PROCESSING", "COMPLETED", "REJECTED"]
//     }
// }, { timestamps: true });

// module.exports = mongoose.model("Withdraw", withdrawSchema);

const mongoose = require('mongoose');

/*
 Withdraw Schema:
 Represents withdrawal request raised by farmer.
*/

const withdrawSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    walletId: {
        type: String,
        required: true
    },

    accountNumber: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "INR"
    },

    status: {
        type: String,
        enum: ["REQUESTED", "APPROVED", "PROCESSING", "COMPLETED", "REJECTED"],
        default: "REQUESTED"
    }

}, { timestamps: true });

module.exports = mongoose.model("Withdraw", withdrawSchema);