const mongoose = require('mongoose');

const BlockTradeSchema = new mongoose.Schema({
    // 1. Core Trade Data
    farmerId: { type: String, required: true },
    buyerId: { type: String, required: true },
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },

    // 2. Blockchain Metadata (The "Truth" Link)
    tradeId: { type: String, required: true, unique: true }, 
    blockNumber: { type: Number },
    blockHash: { type: String }, // The hash of the block where the trade was mined
    transactionHash: { type: String }, // The unique ID for the trade transaction

    // 3. Security Fingerprint
    // This is the SHA-256 hash of (price + quantity + farmerId + buyerId) 
    // that we ALSO store on the blockchain to detect tampering.
    dataFingerprint: { type: String },

    // 4. Status Tracking
    orderStatus: {
        type: String,
        enum: ['PENDING', 'PAID_ESCROW', 'DELIVERED', 'COMPLETED'],
        default: '?'
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlockTrade', BlockTradeSchema);