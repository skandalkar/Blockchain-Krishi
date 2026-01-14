const { ethers } = require('ethers');
require('dotenv').config();

const Order = require('../models/Order');

const TradeABI = require('../../artifacts/contracts/TradeRegistry.sol/TradeRegistry.json').abi;

const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const tradeContract = new ethers.Contract(contractAddress, TradeABI, provider);

function finalizedOrder() {
    tradeContract.on("OrderFinalized",
        async (id, farmer, buyer, crop, price, qty, time, event) => {
            const blockchainId = Number(id);
            console.log(`New Order Detected: ID ${id}`);

            try {
                await Order.updateOne(
                    { blockchainId },
                    {
                        $setOnInsert: {
                            blockchainId,
                            farmer,
                            buyer,
                            crop,
                            price: ethers.formatEther(price),
                            quantity: Number(qty),
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