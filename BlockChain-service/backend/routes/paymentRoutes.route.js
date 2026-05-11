const express = require("express");
const router = express.Router();

const escrowPayment = require("../controllers/EscrowPayment.controller");

router.post("/deposit", escrowPayment.depositFund);

router.post("/confirm-delivery", escrowPayment.confirmDelivery);

module.exports = router;