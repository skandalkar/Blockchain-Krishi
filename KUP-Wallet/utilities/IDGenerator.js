const crypto = require("crypto");

// walletId: Internal unique identifier

const generateWalletId = () => {
    return "wlt_" + crypto.randomBytes(5).toString("hex");
};


//  accountNumber: Human-readable numeric reference

const generateAccountNumber = () => {
    const random = Math.floor(1000000000 + Math.random() * 9000000000);
    return "ACC" + random;
};


// aliasId: User-friendly ID (like UPI)

const generateAliasId = (mobile) => {
    if (!mobile) return undefined;
    return `${mobile}@kup`;
};


/*
 blockchainAddress: Ethereum-like address
 Replace later with real web3.eth.accounts.create()
*/
const generateBlockchainAddress = () => {
    return "0x" + crypto.randomBytes(20).toString("hex");
};


module.exports = {
    generateWalletId,
    generateAccountNumber,
    generateAliasId,
    generateBlockchainAddress
};