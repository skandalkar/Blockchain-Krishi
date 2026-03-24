// const withdrawService = require("../services/Withdraw.service");

// // This functionality referes to the withdrawl requested by the Farmer from his wallet, this Post Deal functionality currently out off scope of project or it would delivered by RazorpayX Escrow Provider.

// //  Money-Withdrawl => To withdraw money from Farmer's own wallet and transfer to his respected bank ( Post-Settlement functionality)

// const requestWithdraw = async (req, res) => {
//     try {
//         const { userId, userRole, amount } = req.body;

//         const withdraw = await withdrawService.requestWithdraw(
//             userId,
//             userRole,
//             amount
//         );

//         res.status(201).json({
//             success: true,
//             data: withdraw
//         });
        
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// };

// module.exports = { requestWithdraw };


const withdrawService = require("../services/Withdraw.service");


// Request Withdrawal
const requestWithdraw = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        const withdraw = await withdrawService.requestWithdraw(
            userId,
            amount
        );

        res.status(201).json({
            success: true,
            data: withdraw
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    requestWithdraw
};