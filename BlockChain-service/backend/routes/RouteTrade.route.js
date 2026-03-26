const express = require('express');
const router = express.Router();

const createOrder = require('../controllers/CreateOrder.controller');
const { verifyTrade } = require("../controllers/VerifyTrade.controller");
const verifyIntegrityTrade = require('../controllers/TradeIntegrity.controller');

router.post('/create', createOrder); 
router.post("/verify/:orderId", verifyTrade); 
router.get('/details/:id', verifyIntegrityTrade);

module.exports = router;