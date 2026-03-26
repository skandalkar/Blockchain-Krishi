const { ethers } = require('ethers');
require('dotenv').config();

const Order = require('../models/Order.model');
const BlockTrade = require('../models/BlockTrade.model');
const TradeABI = require('../../artifacts/contracts/TradeRegistry.sol/TradeRegistry.json').abi;

const { generateDataFingerprint } = require('../utilities/fingerprintGenerator');

const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const tradeContract = new ethers.Contract(contractAddress, TradeABI, provider);

function finalizedOrder() {

    tradeContract.on("OrderFinalized",
        async (id, farmer, buyer, orderId, crop, price, qty, totalCost, time, status, event) => {

            const blockchainId = Number(id);
            console.log(`New Order Detected: ID ${id}`);

            try {
                const farmerAddress = typeof farmer === 'object' ? farmer.hash : farmer;
                const buyerAddress = typeof buyer === 'object' ? buyer.hash : buyer;
                const orderIdString = typeof orderId === 'object' ? orderId.hash : orderId;

                const priceInEther = ethers.formatEther(price);
                const quantity = Number(qty);
                const totalCostInEther = parseFloat(priceInEther) * quantity;

                const txHash = event?.log?.transactionHash ?? event?.transactionHash;
                const blockNumber = event?.log?.blockNumber ?? event?.blockNumber;
                
                if (!txHash || blockNumber == null) {
                    throw new TypeError(
                        `OrderFinalized listener received no event log metadata (txHash=${txHash}, blockNumber=${blockNumber}). ` +
                        `This usually means the listener callback signature doesn't match the Solidity event.`
                    );
                }

                // Save to Order collection DB 
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
                            txHash,
                            timestamp: new Date(Number(time) * 1000),
                        },
                    },
                    { upsert: true }
                );

                // Fetch block details to get blockHash
                const block = await provider.getBlock(blockNumber);

                // Generate data fingerprint for tampering detection
                // const dataFingerprint = generateDataFingerprint(priceInEther, quantity, farmerAddress, buyerAddress);
                const dataFingerprint = generateDataFingerprint(
                    priceInEther,
                    quantity,
                    farmerAddress,
                    buyerAddress,
                    status ?? "PENDING"
                );

                // Save to BlockTrade collection with blockchain metadata
                await BlockTrade.updateOne(
                    { tradeId: orderIdString },
                    {
                        $setOnInsert: {
                            farmerId: farmerAddress,
                            buyerId: buyerAddress,
                            cropName: crop,
                            quantity,
                            price: priceInEther,
                            tradeId: orderIdString,
                            blockNumber,
                            blockHash: block.hash,
                            transactionHash: txHash,
                            dataFingerprint,
                            orderStatus: status ?? 'PENDING'
                        },
                    },
                    { upsert: true }
                );

                console.log(`Order ${blockchainId} synced to Order and Block collections`);
            }
            catch (err) {
                console.error("Sync Error:", err);
            }
        }

    );
}

module.exports = finalizedOrder;