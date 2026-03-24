// const escrowService = require("../services/Escrow.service");

// // Funds locking functionality to the EscrowWaller after Order-Trade Confirmed and Placed
// const lockFunds = async (req, res) => {
//     try {
//         const { buyerId, farmerId, amount, orderId } = req.body;
//         const escrow = await escrowService.lockFunds(
//             buyerId,
//             farmerId,
//             amount,
//             orderId
//         );
//         res.status(201).json({
//             success: true,
//             data: escrow
//         });
//     } catch (err) {
//         res.status(400).json({
//             success: false,
//             message: err.message
//         });
//     }
// };

// // Funds releasing functionality to the EscrowWallet to transfer locked funds with respected orderId and associated farmerId automatically as OrderStatus updates to "DELIVERED" by Buyer. This is an automation event running of smart contract.
// const releaseFunds = async (req, res) => {
//     try {
//         const { orderId, buyerId, farmerId, amount } = req.body;
//         const result = await escrowService.releaseFunds(
//             orderId,
//             buyerId,
//             farmerId,
//             amount
//         );
//         res.json({
//             success: true,
//             message: "Escrow released",
//             data: result
//         });
//     } catch (err) {

//         res.status(400).json({
//             success: false,
//             message: err.message
//         });
//     }
// };

// module.exports = {
//     lockFunds,
//     releaseFunds
// };


const escrowService = require("../services/Escrow.service");

const lockFunds = async (req, res) => {
    try {
        const { buyerId, farmerId, amount, orderId } = req.body;

        const escrow = await escrowService.lockFunds(
            buyerId,
            farmerId,
            amount,
            orderId
        );

        res.status(201).json({
            success: true,
            data: escrow
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

const releaseFunds = async (req, res) => {
    try {
        const { orderId } = req.body;

        const result = await escrowService.releaseFunds(orderId);

        res.json({
            success: true,
            message: "Escrow released",
            data: result
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    lockFunds,
    releaseFunds
};