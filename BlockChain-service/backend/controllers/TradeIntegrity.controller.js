const verifyTradeIntegrity = require('../middleware/verifyIntegrity');

const verifyIntegrrityTrade = async (req, res) => {
    const result = await verifyTradeIntegrity(req.params.id);

    if (result.status === "TAMPERED") {
        return res.status(403).json({
            error: "DATA INTEGRITY BREACHED",
            message: "The data in the database does not match the blockchain record.",
            verification: "FAILED",
            result: result
        });
    } else {
        return res.status(200).json({
            message: "The data is secure and mathes the block record.",
            verification: "Success",
        })
    }
}

module.exports = verifyIntegrrityTrade;