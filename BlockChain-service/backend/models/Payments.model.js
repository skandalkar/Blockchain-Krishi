const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({

    tradeId: { type: String, unique: true },
    paymentBlockchainId: { type: Number, unique: true },
    blockchainId: { type: Number, unique: true },
    farmerId: { type: String, required: true },
    buyerId: { type: String, required: true },
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalCost: { type: Number, required: true },

    orderStatus: {
        type: String,
        enum: [
            "PENDING",
            "ESCROW_LOCKED",
            "DELIVERED",
            "COMPLETED"
        ],
        default: "PENDING"
    },

    transactionHash: String,
    paymentTxHash: String,
    timestamp: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Payment", PaymentSchema);