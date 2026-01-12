const express = require('express');
const router = express.Router();
const createOrder = require('../controllers/CreateOrder');
const { verifyTrade } = require("../controllers/trade.controller");

router.post('/create', createOrder); // Endpoint for order creation on blockchain and copy to Database

router.get("/verify/:orderId", verifyTrade); // Endpoint for trade verification

module.exports = router;