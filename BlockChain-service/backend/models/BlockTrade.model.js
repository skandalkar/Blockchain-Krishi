const mongoose = require('mongoose');

const BlockTradeSchema = new mongoose.Schema({
    // Core Trade Data
    farmerId: { type: String, required: true },
    buyerId: { type: String, required: true },
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },

    // Blockchain Metadata (The "Truth" Link)
    tradeId: { type: String, required: true, unique: true }, 
    blockNumber: { type: Number },
    blockHash: { type: String }, // The hash of the block where the trade was mined
    transactionHash: { type: String }, // The unique ID for the trade transaction

    // Security Fingerprint
    // This is the SHA-256 hash of (price + quantity + farmerId + buyerId + status) 
    // that we ALSO store on the blockchain to detect tampering.
    dataFingerprint: { type: String },

    // Status Tracking
    orderStatus: {
        type: String,
        enum: ['PENDING', 'DELIVERED', 'COMPLETED'],
        default: '?'
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlockTrade', BlockTradeSchema);