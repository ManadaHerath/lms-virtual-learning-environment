const express = require("express");
const PaymentsController = require("../controllers/PaymentsController");

const router = express.Router();

// Notify endpoint
router.post("/notify", PaymentsController.notify);

// Generate hash for payment
router.post("/generate-hash", PaymentsController.generateHashEndpoint);


module.exports = router;
