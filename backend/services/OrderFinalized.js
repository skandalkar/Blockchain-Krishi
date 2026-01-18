const { ethers } = require('ethers');
require('dotenv').config();

const Order = require('../models/Order');
const TradeABI = require('../../artifacts/contracts/TradeRegistry.sol/TradeRegistry.json').abi;

const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const tradeContract = new ethers.Contract(contractAddress, TradeABI, provider);

function finalizedOrder() {
    tradeContract.on("OrderFinalized",
        async (id, farmer, buyer, orderId, crop, price, qty, totalCost, time, event) => {
            const blockchainId = Number(id);
            console.log(`New Order Detected: ID ${id}`);
            
            try {
                const farmerAddress = typeof farmer === 'object' ? farmer.hash : farmer;
                const buyerAddress = typeof buyer === 'object' ? buyer.hash : buyer;
                const orderIdString = typeof orderId === 'object' ? orderId.hash : orderId;

                const priceInEther = parseFloat(ethers.formatEther(price));
                const quantity = Number(qty);
                const totalCostInEther = priceInEther * quantity;
                
                await Order.updateOne(
                    { blockchainId },
                    {
                        $setOnInsert: {
                            blockchainId,
                            farmer: farmerAddress,
                            buyer: buyerAddress,
                            orderId: orderIdString,
                            crop,
                            price: ethers.formatEther(price),
                            quantity: Number(qty),
                            totalCost: totalCostInEther,
                            txHash: event.log.transactionHash,
                            timestamp: new Date(Number(time) * 1000),
                        },
                    },
                    { upsert: true }
                );

                console.log(`Order ${blockchainId} synced successfully`);
            }
            catch (err) {
                console.error("Sync Error:", err);
            }
        }

    );
}

module.exports = finalizedOrder;