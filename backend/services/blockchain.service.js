const { ethers } = require("ethers");
require("dotenv").config();

const abi = require('../../artifacts/contracts/TradeRegistry.sol/TradeRegistry.json').abi;

const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);

const fetchTradeFromBlockchain = async (txHash) => {
    
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) throw new Error("Transaction not found");

    const parsedLogs = receipt.logs.map((log) => {
        try {
            const parsed = contract.interface.parseLog(log);
            return parsed;
        } catch (e) {
            console.log("Failed to parse a log entry. Log address:", log.address);
            return null;
        }
    }).filter(Boolean);

    const tradeEvent = parsedLogs.find(
        (log) => log.name === "OrderFinalized"
    );

    if (!tradeEvent) throw new Error("OrderFinalized event not found");

    return {
        farmer: tradeEvent.args.farmer,
        buyer: tradeEvent.args.buyer,
        crop: tradeEvent.args.crop,
        price: (ethers.formatUnits(tradeEvent.args.price, 18)).toString(),
        quantity: Number(tradeEvent.args.quantity),
    };
};

module.exports = { fetchTradeFromBlockchain };