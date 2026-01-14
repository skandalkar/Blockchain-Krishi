const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    blockchainId: { type: Number, unique: true },
    farmer: String,
    buyer: String,
    crop: String,
    price: String,
    quantity: Number,
    txHash: String,
    timestamp: Date
});

module.exports = mongoose.model('Order', OrderSchema);