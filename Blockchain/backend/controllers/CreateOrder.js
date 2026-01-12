const { ethers } = require('ethers');

require('dotenv').config();

// 1. Correct ABI Import
const TradeABI = require('../../artifacts/contracts/TradeRegistry.sol/TradeRegistry.json').abi;

const ContractAddress = process.env.CONTRACT_ADDRESS;

const createOrder = async(req, res) =>{
    try {
        const { buyerAddress, price, quantity } = req.body;
        
        const provider = new ethers.JsonRpcProvider();
        
        const signer = await provider.getSigner(); 
        
        const tradeContract = new ethers.Contract(ContractAddress, TradeABI, signer);

        const tx = await tradeContract.createOrder(
            buyerAddress, 
            ethers.parseEther(price.toString()), 
            quantity
        );
        
        console.log("Transaction Hash:", tx.hash);
        await tx.wait();

        res.status(200).json({ 
            success: true, 
            message: "Order finalized on Blockchain!", 
            txHash: tx.hash,
            blockchainId: tx.blockchainId 
        });
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = createOrder;


