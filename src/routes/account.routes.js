const express = require("express");
const accountController = require("../controllers/account.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


//For Account is Active
router.post("/",authMiddleware.authMiddleware,accountController.createAccountController)


//get User Accounts from DB
router.get("/",authMiddleware.authMiddleware,accountController.getUserAccounts);

//get account balance by id
router.get("/balance/:id",authMiddleware.authMiddleware,accountController.getAccountBalance);
module.exports = router;