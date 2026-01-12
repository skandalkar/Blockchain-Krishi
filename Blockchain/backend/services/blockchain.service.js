const { ethers } = require("ethers");
// const abi = require("../abi/TradeContract.json");

const TradeABI = require('../../artifacts/contracts/TradeRegistry.sol/TradeRegistry.json').abi;

const abi = TradeABI;

const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);

const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    abi,
    provider
);

exports.fetchTradeFromBlockchain = async (txHash) => {
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) throw new Error("Transaction not found");

    const parsedLogs = receipt.logs
        .map((log) => {
            try {
                return contract.interface.parseLog(log);
            } catch {
                return null;
            }
        })
        .filter(Boolean);

    const tradeEvent = parsedLogs.find(
        (log) => log.name === "TradeFinalized"
    );

    if (!tradeEvent) throw new Error("TradeFinalized event not found");

    return {
        buyer: tradeEvent.args.buyer,
        price: tradeEvent.args.price.toString(),
        quantity: Number(tradeEvent.args.quantity),
    };
};