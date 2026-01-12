const express = require('express');
const router = express.Router();
const createOrder = require('../controllers/CreateOrder');
const  {verifyTrade}  = require("../controllers/trade.controller");

router.post('/create', createOrder);

router.get("/verify/:tradeId", verifyTrade);

module.exports = router;