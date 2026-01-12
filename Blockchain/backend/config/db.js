const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    // 1. Event Listeners for Mongoose Connection 
    
    /** These monitor the health of the connection over time */
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected! Attempting to reconnect...');
    });

    mongoose.connection.on('error', (err) => {
        console.error('Mongoose runtime connection error:', err);
    });

    // 2. Initial Connection Logic
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully to Database.');
    } catch (error) {
        console.error('Initial MongoDB connection error:', error.message);
        process.exit(1); 
    }
}

module.exports = connectDB;