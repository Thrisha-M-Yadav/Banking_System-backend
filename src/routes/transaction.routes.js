const express = require("express");
const TransactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/",authMiddleware.authMiddleware,TransactionController.createTransaction);

router.post("/system/initial-funds",authMiddleware.authSystemMiddleware,TransactionController.createInitialFundsTransaction)


module.exports = router;
