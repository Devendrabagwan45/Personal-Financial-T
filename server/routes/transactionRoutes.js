import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  getRecentTransactions,
  updateTransaction,
} from "../controllers/transactionController.js";

const transactionRouter = express.Router();

// Create a new transaction
transactionRouter.post("/addTransaction", protectRoute, createTransaction);

// Update an existing transaction by ID
transactionRouter.put(
  "/updateTransaction/:id",
  protectRoute,
  updateTransaction
);

// Get all transactions
transactionRouter.get("/getTransactions", protectRoute, getTransactions);

// Get recent transactions
transactionRouter.get("/recent", protectRoute, getRecentTransactions);

// Delete a transaction by ID
transactionRouter.delete(
  "/deleteTransaction/:id",
  protectRoute,
  deleteTransaction
);

export default transactionRouter;
