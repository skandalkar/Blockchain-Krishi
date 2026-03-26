const express = require('express');
require('dotenv').config();

const connectDB = require('./config/db');
const finalizedOrder = require('./services/OrderFinalized.service');
const tradeRoutes = require('./routes/RouteTrade.route')
const paymentRoutes = require('./routes/paymentRoutes.route');
require("./listeners/blockchainListener");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

finalizedOrder();

app.get('/', (req, res) => {
    res.send('Welcome to the Blockchain Backend Service');
})

// OrderTrade Creation, Retrieval and VerificationRoutes
app.use('/api/trade', tradeRoutes);

// Payment Deposit and Release Routes
app.use('/api/payment', paymentRoutes);

app.listen(PORT || 5000, () => {
    console.log(`Server is running on PORT ${PORT || 5000}`)
});