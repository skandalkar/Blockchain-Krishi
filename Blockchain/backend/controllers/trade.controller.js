const { fetchTradeFromBlockchain } = require('../services/blockchain.service');

exports.verifyTrade = async (req, res) => {
    try {
        const { tradeId } = req.params;

        // 1. Fetch from DB
        const trade = await orders.findById(tradeId);
        if (!trade) {
            return res.status(404).json({
                success: false,
                message: "Trade not found in database",
            });
        }

        // 2. Fetch from Blockchain
        const chainTrade = await fetchTradeFromBlockchain(trade.txHash);

        // 3. Compare
        const verified =
            trade.price === chainTrade.price &&
            trade.quantity === chainTrade.quantity;

        res.json({
            success: true,
            verified,
            database: {
                price: trade.price,
                quantity: trade.quantity,
            },
            blockchain: chainTrade,
        });
    } catch (error) {
        console.error("Verification error:", error.message);
        res.status(500).json({
            success: false,
            message: "Blockchain verification failed",
        });
    }
};
