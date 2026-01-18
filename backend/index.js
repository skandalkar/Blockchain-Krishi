const express = require('express');
require('dotenv').config();

const connectDB = require('./config/db');
const finalizedOrder = require('./services/OrderFinalized');
const tradeRoutes = require('./routes/RouteTrade')
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

connectDB();

finalizedOrder();

app.get('/', (req, res) => {
    console.log(`Received request: GET -> http://localhost:${PORT}/`);
    res.send('Welcome to the Trade Registry Blockchain Backend Service');
})

// OrderTrade Creation, Retrieval and VerificationRoutes
app.use('/api/trade', tradeRoutes);

// Payment Deposit and Release Routes
app.use('/api/payment', paymentRoutes);

app.listen(PORT || 5000, () => {
    console.log(`Server is running on PORT ${PORT || 5000}`)
});