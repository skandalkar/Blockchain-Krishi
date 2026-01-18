const { fetchTradeFromBlockchain } = require('../services/blockchain.service');
const orders = require('../models/Order');

const verifyTrade = async (req, res) => {

    try {
        const { orderId } = req.params;

        const trade = await orders.findOne({ orderId });
        if (!trade) {
            return res.status(404).json({
                success: false,
                message: "Trade not found in database",
            });
        }

        const chainTrade = await fetchTradeFromBlockchain(trade.txHash);
        const verified = trade.price === chainTrade.price && trade.quantity === chainTrade.quantity;

        res.json({
            success: true,
            verified,
            database: {
                crop: trade.crop,
                price: trade.price,
                quantity: trade.quantity,
                totalAmount: trade.totalCost
            },
            txHash: trade.txHash,
            blockchain: { chainTrade }
        });

    } catch (error) {
        console.error("Verification error:", error.message);
        res.status(500).json({
            success: false,
            message: "Blockchain verification failed",
        });
    }
};

module.exports = { verifyTrade };