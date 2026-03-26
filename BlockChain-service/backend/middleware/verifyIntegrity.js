const { ethers } = require('ethers');
const BlockTrade = require('../models/BlockTrade.model');
const Trade = require('../models/Order.model');

const { fetchTradeFromBlockchain } = require('../services/blockchain.service');
const { generateDataFingerprint } = require('../utilities/fingerprintGenerator');
require('dotenv').config();

const fetchFromMainDB = async (orderId) => {
    try {
        
        // Fetch the main trade record to get the blockchain transaction hash
        const mainTrade = await Trade.findOne({ orderId });
        
        if (!mainTrade) {
            console.error(`Main trade record not found for Trade ID: ${orderId}`);
            return { status: "NOT_FOUND", message: "Main trade record not found in database" };
        }

        // Generate fingerprint from the main trade record
        const mainDbFingerprint = generateDataFingerprint(
            mainTrade.price.toString(),
            mainTrade.quantity.toString(),
            mainTrade.farmer.toString(),
            mainTrade.buyer.toString()
        );
        
        return {
            mainTrade: mainTrade,
            dataFingerprint: mainDbFingerprint
        };
    } catch (error) {
        console.error(`Error in fetchFromMainDB:`, error.message);
        return { status: "ERROR", message: error.message };
    }
}

const verifyTradeIntegrity = async (tradeId) => {
    try {

        console.log(`Verifying integrity for Trade ID: ${tradeId}`);

        // Fetch the main trade record to get the blockchain transaction hash
        const mainDBRecord = await fetchFromMainDB(tradeId);
        
        if (mainDBRecord.status === "NOT_FOUND" || mainDBRecord.status === "ERROR") {
            console.error(`Cannot proceed: ${mainDBRecord.message}`);
            return mainDBRecord;
        }
        
       // Extract the fingerprint from the main trade record
        const mainDbFingerprint = mainDBRecord.dataFingerprint;

        // 1. Get the data from MongoDB BlockTrade collection
        const dbRecord = await BlockTrade.findOne({ tradeId });

        if (!dbRecord) return { status: "NOT_FOUND", message: "Trade not found in database" };

        // 2. Connect to Blockchain and fetch the REAL transaction data
        const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);

        // 3. Fetch the REAL transaction receipt from the Blockchain
        const txReceipt = await provider.getTransactionReceipt(dbRecord.transactionHash);
        if (!txReceipt) return { status: "TX_NOT_FOUND", message: "Transaction not found on blockchain" };

        // 4. Get the actual trade data from blockchain
        const blockchainTrade = await fetchTradeFromBlockchain(dbRecord.transactionHash);

        // 5. Verify blockNumber - immutability proof
        const blockNumberMatch = (dbRecord.blockNumber === txReceipt.blockNumber);

        if (!blockNumberMatch) {
            console.error(`ALERT: BLOCK NUMBER MISMATCH in Trade ${tradeId}!`);
            console.error(`Database: ${dbRecord.blockNumber} vs Blockchain: ${txReceipt.blockNumber}`);
            return { status: "TAMPERED", reason: "BLOCK_NUMBER_MISMATCH", data: dbRecord };
        }

        // 6. Regenerate dataFingerprint from BLOCKCHAIN data (the truth source)
        const blockchainFingerprint = generateDataFingerprint(
            blockchainTrade.price,
            blockchainTrade.quantity,
            blockchainTrade.farmer,
            blockchainTrade.buyer
        );
        console.log(`Blockchain Fingerprint Generated from Blockchain Data: ${blockchainFingerprint}`);

        // 7. Compare MainDB fingerprint with Blockchain fingerprint
        // Blockchain is the source of truth - if they don't match, MainDB was tampered
        if (mainDbFingerprint !== blockchainFingerprint) {
            console.error(`ALERT: DATA TAMPERING DETECTED in Main Database for Trade ${tradeId}!`);
            console.error(`Main DB Fingerprint: ${mainDbFingerprint}`);
            console.error(`Blockchain Fingerprint (VALID PROOF): ${blockchainFingerprint}`);
            console.error(`This means: price, quantity, farmer, or buyer was altered in MainDB after blockchain confirmation!`);
            return {
                status: "TAMPERED",
                reason: "MAIN_DB_DATA_TAMPERED",
                mainDbFingerprint: mainDbFingerprint,
                blockchainFingerprint: blockchainFingerprint,
                message: "Blockchain is the valid proof - MainDB data was tampered",
                data: dbRecord
            };
        } else {
            // 8. All checks passed
            console.log(`Integrity Verified for Trade ${tradeId}: Match 100%`);
            console.log(`✓ Block Number: ${dbRecord.blockNumber}`);
            console.log(`✓ Data Fingerprint: ${dbRecord.dataFingerprint}`);
            return {
                status: "SECURE",
                message: "All security checks passed",
                data: dbRecord,
                blockchainData: blockchainTrade
            };
        }
    } catch (error) {
        console.error(`Verification Error for Trade ${tradeId}:`, error.message);
        return { status: "ERROR", message: error.message };
    }
};

module.exports = verifyTradeIntegrity;