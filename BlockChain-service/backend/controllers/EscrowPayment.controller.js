const { ethers } = require("ethers");
require("dotenv").config();

const { fetchTradeFromBlockchain } = require("../services/blockchain.service");
const Orders = require("../models/Order.model");

const EscrowABI = require("../../artifacts/contracts/EscrowPayment.sol/EscrowPayment.json").abi;

const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
const escrowAddress = process.env.ESCROW_CONTRACT_ADDRESS;

const depositFund = async (req, res) => {

    try {

        const { orderId, farmerAddress, buyerAddress } = req.body;

        const order = await Orders.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found in DB"
            });
        }

        const tradeOnChain = await fetchTradeFromBlockchain(order.txHash);

        if (!tradeOnChain) {
            return res.status(404).json({
                success: false,
                message: "Trade not found on blockchain"
            });
        }

        const signer = await provider.getSigner(buyerAddress);

        const escrowContract = new ethers.Contract(
            escrowAddress,
            EscrowABI,
            signer
        );

        const numericOrderId = BigInt(orderId.replace(/\D/g, ""));

        const tx = await escrowContract.deposit(
            numericOrderId,
            buyerAddress,
            farmerAddress
        );

        await tx.wait();

        res.json({
            success: true,
            txHash: tx.hash,
            message: "Escrow registered on blockchain"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }
};


const confirmDelivery = async (req, res) => {

    try {

        const { orderId, buyerAddress } = req.body;

        const order = await Orders.findOne({ orderId });

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        const signer = await provider.getSigner(buyerAddress);

        const escrowContract = new ethers.Contract(
            escrowAddress,
            EscrowABI,
            signer
        );

        const numericOrderId = BigInt(orderId.replace(/\D/g, ""));

        const tx = await escrowContract.confirmDelivery(numericOrderId);

        await tx.wait();

        res.json({
            success: true,
            txHash: tx.hash,
            message: "Delivery confirmed on blockchain"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }
};

module.exports = { depositFund, confirmDelivery };