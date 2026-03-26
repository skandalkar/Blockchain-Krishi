const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    blockchainId: { type: Number, unique: true },
    orderId: { type: String, unique: true },
    farmer: String,
    buyer: String,
    crop: String,
    price: Number,
    quantity: Number,
    totalCost: Number,
    txHash: String,
    timestamp: Date
});

module.exports = mongoose.model('Order', OrderSchema);