// const walletService = require("../services/Wallet.service");

// // Wallet Management for User's Wallet as per role:
// // Buyer: Auto-create as logs to system, add, view wallet
// // Farmer: Auto-create as logs to system view-only access to wallet cannot add funds to wallet but can withdraw to actual banks as per rais of request: withdraw

// // Auto-create as logs to system. Common role: Buyer, Farmer
// const createWallet = async (req, res) => {
//     try {
//         const { userId, userRole } = req.body;
//         const wallet = await walletService.createWallet(userId, userRole);
//         res.status(201).json({
//             success: true,
//             data: wallet
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// };

// // Common role: Buyer, Farmer
// const getWallet = async (req, res) => {
//     try {
//         const wallet = await walletService.getWallet(req.params.userId);
//         res.json({
//             success: true,
//             data: wallet
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// };

// // Only rights to add balance to wallet for authorized to only Buyer.
// const addBalance = async (req, res) => {
//     try {
//         const { userId, amount } = req.body;
//         const wallet = await walletService.addBalance(userId, amount);
//         res.json({
//             success: true,
//             data: wallet
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// };

// module.exports = {
//     createWallet,
//     getWallet,
//     addBalance
// }

const walletService = require("../services/Wallet.service");

//  Create Wallet

const createWallet = async (req, res) => {
    try {
        const { userId, userRole, mobile } = req.body;

        const wallet = await walletService.createWallet(userId, userRole, mobile);

        res.status(201).json({
            success: true,
            data: wallet
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


//  Get Wallet
const getWallet = async (req, res) => {
    try {
        const wallet = await walletService.getWallet(req.params.userId);

        res.json({
            success: true,
            data: wallet
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Add Balance (Buyer only)
const addBalance = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        const wallet = await walletService.addBalance(userId, amount);

        res.json({
            success: true,
            data: wallet
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    createWallet,
    getWallet,
    addBalance
};