const express = require('express');
require('dotenv').config();

// Database Connection
const connectDB = require('./config/db');

// Services
const finalizedOrder = require('./services/OrderFinalized');

//Routes 
const tradeRoutes = require('./routes/tradeRoutes');

const app = express();
app.use(express.json());

connectDB();

// Blockchain Event Listener
finalizedOrder();

app.get('/', (req, res) => {
    res.send('Welcome to the Trade Registry Blockchain Backend Service');
})

app.use('/api/trade', tradeRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on PORT ${process.env.PORT || 5000}`)
});