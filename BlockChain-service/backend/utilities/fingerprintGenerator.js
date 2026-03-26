const crypto = require('crypto');

// Generate consistent SHA-256 fingerprint for trade data
// This function is used in both OrderFinalized and verifyIntegrity to ensure fingerprints match

// function generateDataFingerprint(price, quantity, farmerId, buyerId, status) {
// Normalize data types to ensure consistency across different sources Use separators to avoid hash collisions

function generateDataFingerprint(price, quantity, farmerId, buyerId, status = "") {
    const data = `${price}|${quantity}|${farmerId}|${buyerId}|${status}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports = { generateDataFingerprint };