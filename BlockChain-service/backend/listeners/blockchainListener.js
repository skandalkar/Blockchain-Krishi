const { ethers } = require("ethers");
const axios = require("axios");
require("dotenv").config();

const EscrowABI = require("../../artifacts/contracts/EscrowPayment.sol/EscrowPayment.json").abi;

const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);

const contract = new ethers.Contract(
    process.env.ESCROW_CONTRACT_ADDRESS,
    EscrowABI,
    provider
);

console.log("Blockchain Listener Started...");

contract.on("DeliveryConfirmed", async (orderId, buyer, farmer) => {

    console.log("Delivery confirmed:", orderId.toString());

    try {

        await axios.post(
            "http://localhost:5005//api/v1/pay-system-kup/payout/release",
            {
                orderId: orderId.toString()
            }
        );

        console.log("Escrow released in Wallet Service");

    } catch (error) {

        console.error("Wallet payout failed:", error.message);

    }

});