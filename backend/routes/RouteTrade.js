const express = require('express');
const router = express.Router();

const createOrder = require('../controllers/CreateOrder');
const { verifyTrade } = require("../controllers/TradeController");

router.post('/create', createOrder); 
router.post("/verify/:orderId", verifyTrade); 

module.exports = router;