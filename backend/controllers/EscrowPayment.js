const { ethers } = require('ethers');
require('dotenv').config();

const EscrowABI = require('../../artifacts/contracts/EscrowPayment.sol/EscrowPayment.json').abi;

const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
const escrowAddress = process.env.ESCROW_CONTRACT_ADDRESS;

const depositFund = async (req, res) => {

    try {
        const { orderId, farmerAddress, amount } = req.body;

        const signer = await provider.getSigner();
        const escrowContract = new ethers.Contract(escrowAddress, EscrowABI, signer);

        const numericOrderId = BigInt(orderId.replace(/\D/g, ""));
        const tx = await escrowContract.deposit(numericOrderId, farmerAddress, {
            value: ethers.parseEther(amount.toString())
        });

        await tx.wait();

        res.json({ success: true, txHash: tx.hash, amount: amount, message: "Funds locked in escrow" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const confirmDelivery = async (req, res) => {

    try {
        const { orderId } = req.body;

        const signer = await provider.getSigner();
        const escrowContract = new ethers.Contract(escrowAddress, EscrowABI, signer);

        const numericOrderId = BigInt(orderId.replace(/\D/g, ""));
        const tx = await escrowContract.confirmDelivery(numericOrderId);
        await tx.wait();

        res.json({ success: true, txHash: tx.hash, message: "Funds released to farmer" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { depositFund, confirmDelivery };