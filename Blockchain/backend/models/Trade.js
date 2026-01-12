const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
    farmer: String,
    buyer: String,
    price: String,
    quantity: Number,
    txHash: String,
    timestamp: Date,
});

module.exports = mongoose.model("Trade", tradeSchema);
