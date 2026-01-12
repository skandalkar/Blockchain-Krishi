const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    blockchainId: Number, // ID from the blockchain event
    farmer: String, // Famer's Address
    buyer: String,  // Buyer's Address
    price: String, // Stored as string to handle large crypto numbers
    quantity: Number, // Quantity of goods
    txHash: String, // Reference to the blockchain transaction
    timestamp: Date // Time of order finalization
});

module.exports = mongoose.model('Order', OrderSchema);