const { ethers } = require('ethers');
const Order = require('../models/Order.model');
const BlockTrade = require('../models/BlockTrade.model');
const { generateDataFingerprint } = require('../utilities/fingerprintGenerator');

const TradeABI = require('../../artifacts/contracts/TradeRegistry.sol/TradeRegistry.json').abi;

const updateOrderStatus = async (req, res) => {
    
    try {
        const { orderId, status, buyerPrivateKey } = req.body;

        if (!buyerPrivateKey) {
            return res.status(400).json({ error: "Buyer private key required" });
        }

        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);

        // Create wallet from buyer private key
        const wallet = new ethers.Wallet(buyerPrivateKey, provider);

        // Debug check (VERY IMPORTANT)
        const signerAddress = await wallet.getAddress();

        if (signerAddress.toLowerCase() !== order.buyer.toLowerCase()) {
            return res.status(403).json({
                error: "Unauthorized",
                message: "Private key does not match buyer address"
            });
        }

        const contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            TradeABI,
            wallet
        );

        // Generate fingerprint (WITH STATUS)
        const fingerprint = generateDataFingerprint(
            order.price,
            order.quantity,
            order.farmer,
            order.buyer,
            status
        );

        // Call blockchain
        const tx = await contract.updateOrderStatus(
            order.blockchainId,
            status,
            fingerprint
        );

        await tx.wait();

        // Update DB
        await Order.updateOne({ orderId }, { status });

        await BlockTrade.updateOne(
            { tradeId: orderId },
            {
                orderStatus: status,
                dataFingerprint: fingerprint
            }
        );

        res.json({
            success: true,
            message: "Order status updated successfully",
            txHash: tx.hash
        });

    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = updateOrderStatus;