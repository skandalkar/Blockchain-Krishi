const { ethers } = require('ethers');
require('dotenv').config();

const generateOrderId = require('../utilities/OrderIdGeneration')
const TradeABI = require('../../artifacts/contracts/TradeRegistry.sol/TradeRegistry.json').abi;

const ContractAddress = process.env.CONTRACT_ADDRESS;

const createOrder = async (req, res) => {
    try {
        var orderId = generateOrderId();
        const { buyerAddress, crop, price, quantity } = req.body;
        const totalCost = price * quantity;

        const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
        const signer = await provider.getSigner();
        const tradeContract = new ethers.Contract(ContractAddress, TradeABI, signer);

        const tx = await tradeContract.createOrder(
            buyerAddress,
            orderId,
            crop,
            ethers.parseEther(price.toString()),
            quantity,
            ethers.parseEther(totalCost.toString())
        );

        await tx.wait();

        res.status(200).json({
            success: true,
            message: "Order finalized on Blockchain!",
            orderId: orderId,
            txHash: tx.hash
        });
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = createOrder;