const express = require('express');
require('dotenv').config();
cors = require('cors');

const connectDB = require('./config/db')

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5005;

connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to the KUP_Wallet System');
})

// Routes for Wallet Management
app.use("/api/v1/pay-system-kup/wallet", require("./routes/Wallet.route"));

// Routes for Escrow-Wallet Management
app.use("/api/v1/pay-system-kup/escrow", require("./routes/Escrow.route"));

// Money-Withdrawl: To withdraw money from Farmer's own wallet and transfer to his respected bank ( Post-Settlement functionality) as per requested by farmer or raise request to transfer money from his wallet.
app.use("/api/v1/pay-system-kup/withdraw", require("./routes/Withdraw.route"));

// Payout-System (Actual user's banks functionalaity. Status: Yet to implement)
app.use("/api/v1/pay-system-kup/payout", require("./routes/Payout.route"));

app.listen(PORT, () => {
    console.log("KUP Wallet server running");
});