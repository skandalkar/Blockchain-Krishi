const { fetchTradeFromBlockchain } = require('../services/blockchain.service');
const orders = require('../models/Order.model');
const blockTrade = require('../models/BlockTrade.model');

const verifyTrade = async (req, res) => {

    try {
        const { orderId } = req.params;

        const tradeOffChain = await orders.findOne({ orderId });
        const tradeOnChain = await blockTrade.findOne({ tradeId: orderId })

        const trade = tradeOffChain && tradeOnChain;

        if (!trade) {
            return res.status(404).json({
                success: false,
                message: "Trade not found in database",
            });
        }

        if (trade) {
            const chainTrade = await fetchTradeFromBlockchain(tradeOffChain.txHash);
            const verified = (tradeOffChain.price === chainTrade.price && tradeOffChain.quantity === chainTrade.quantity);

            res.json({
                success: true,
                verified,
                database: {
                    crop: tradeOffChain.crop,
                    price: tradeOffChain.price,
                    quantity: tradeOffChain.quantity,
                    totalAmount: tradeOffChain.totalCost
                },
                txHash: tradeOffChain.transactionHash,
                blockchain: { chainTrade }
            });
        }

    } catch (error) {
        console.error("Verification error:", error.message);
        res.status(500).json({
            success: false,
            message: "Blockchain verification failed",
        });
    }
};

module.exports = { verifyTrade };