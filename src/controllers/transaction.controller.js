const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailServices = require("../services/email.services");
const mongoose = require("mongoose");


async function createTransaction(req,res){

    //Validate Request

    const{fromAccount , toAccount , amount, idompotencyKey} = req.body;
    if(!fromAccount|| !toAccount || !amount || !idompotencyKey){
        return res.status(400).json({
            message : "fromAccount , toAccount , amount, idompotencyKey are required"
        })

    }

    const fromUserAccount= await accountModel.findOne({
        _id:fromAccount,
    })
    const toUserAccount= await accountModel.findOne({
        _id:toAccount,
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message:"INVALID fromAccount or ToAccount"
        })
    }
    

    //Check account status

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
           message:"Both fromAccount and toAccount must be ACTIVE for transaction"
        })

    }


    //Validate Idempotency Key

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED"){
            return res.status(200).json({
                message:"Transaction already processed",
                transaction:isTransactionAlreadyExists
            })
        }
        if(isTransactionAlreadyExists.status === "PENDING"){
            return res.status(200).json({
                message:"Transaction is still processing",
            })
        }
        if(isTransactionAlreadyExists.status === "FAILED"){
            return res.status(500).json({
                message:"Transaction processing failed previously , please RETRY",
            })
        }
        if(isTransactionAlreadyExists.status === "REVERSED"){
            return res.status(500).json({
                message:"Transaction was reversed , please RETRY",
            })
        }
    }





    //Derive Sender balance from Ledger--

    const balance = await fromUserAccount.getBalance()

    if(balance < amount){
        return res.status(400).json({
           message:`Insufficient Balance .\n Current Balance is ${balance}.\nRequested amount is ${amount}.`
        })
    }


    //Create Transaction(PENDING)--
    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel.create({
        fromAccount , 
        toAccount , 
        amount, 
        idempotencyKey,
        status:"PENDING"
    },{session})

    const debitLedgerEntry = await ledgerModel.create({
        account:fromAccount,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    },{session})

    const creditLedgerEntry = await ledgerModel.create({
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    },{session})

    transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()


    //Send Email notification---

    await emailServices.sendTransactionEmail(req.user.email , req.user.name, amount, toAccount)
    return res.status(201).json({
        message:"Transaction Commpleted successfully",
        transaction : transaction
    })
     

}

async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount, idempotencyKey are required"
        });
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
        status: "ACTIVE"
    });

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount"
        });
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id,
        status: "ACTIVE"
    });

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System User account not found"
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const transaction = new transactionModel({
            fromAccount: fromUserAccount._id,
            toAccount: toUserAccount._id,
            amount,
            idempotencyKey,
            status: "PENDING"
        });

        await transaction.save({ session });

        await ledgerModel.create([{
            account: fromUserAccount._id,
            amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });

        await ledgerModel.create([{
            account: toUserAccount._id,
            amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });

        transaction.status = "COMPLETED";

        await transaction.save({ session });

        await session.commitTransaction();

        

        return res.status(201).json({
            message: "Initial funds transaction completed successfully",
            transaction
        });


    } catch (err) {
        await session.abortTransaction();

        return res.status(500).json({
            message: "Initial funds transaction failed",
            error: err.message
        });

    } finally {
        session.endSession();
    }
}

module.exports={createTransaction,createInitialFundsTransaction};