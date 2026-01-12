const { ethers } = require('ethers');
require('dotenv').config();

// Models
const Order = require('../models/Order');

// ABI Import
const TradeABI = require('../../artifacts/contracts/TradeRegistry.sol/TradeRegistry.json').abi;

// 1. Setup Blockchain Provider (Hardhat Local Node)
const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const tradeContract = new ethers.Contract(contractAddress, TradeABI, provider);

// 2. Listen for Blockchain Events
function finalizedOrder() {
    tradeContract.on("OrderFinalized",
        async (id, farmer, buyer, price, qty, time, event) => {
            console.log(`New Order Detected: ID ${id}`);

            try {
                const newOrder = new Order({
                    blockchainId: Number(id),
                    farmer: farmer,
                    buyer: buyer,
                    price: ethers.formatEther(price),
                    quantity: Number(qty),
                    txHash: event.log.transactionHash,
                    timestamp: new Date(Number(time) * 1000)
                });

                await newOrder.save();
                console.log("Order synced to MongoDB");
            } catch (err) {
                console.error("Sync Error:", err);
            }
        });
}

module.exports = finalizedOrder;