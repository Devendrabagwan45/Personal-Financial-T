import mongoose from "mongoose";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";

//create a new transaction
export const createTransaction = async (req, res) => {
  try {
    const { userId, amount, description, category, type, date } = req.body;

    //validate required fields
    if (!userId || !amount || !description || !category || !type || !date) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    //validate amount is a number
    if (isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Amount must be a positive number" });
    }

    // Convert type to match enum values (Income/Expense)
    const formattedType =
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

    //create transaction
    const transaction = await Transaction.create({
      userId,
      amount: Number(amount),
      description,
      category,
      type: formattedType,
      date: new Date(date),
    });

    //update user's balance
    await User.findByIdAndUpdate(userId, {
      $inc: {
        balance: formattedType === "Income" ? Number(amount) : -Number(amount),
      },
    });

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    console.error("Transaction creation error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

//get all transactions for a user
export const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, recentDays } = req.query;
    // Use authenticated user's ID from JWT token
    const userId = req.user._id;
    //Build filter object
    const filter = { userId };

    if (type) filter.type = type;
    if (category) filter.category = category;

    // Handle recent transactions query
    if (recentDays) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(recentDays));
      filter.date = { $gte: daysAgo };
    } else if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    //sort by date (newest first)
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    return res.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("error fetching transactions:", error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

//get recent transactions for a user
export const getRecentTransactions = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Use authenticated user's ID from JWT token
    const userId = req.user._id;

    const recentTransactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    return res.json({
      success: true,
      count: recentTransactions.length,
      transactions: recentTransactions,
    });
  } catch (error) {
    console.error("error fetching recent transactions:", error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

//update a transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category, type, date } = req.body;

    //find existing transaction
    const oldTransaction = await Transaction.findById(id);
    if (!oldTransaction) {
      return res
        .status(404)
        .json({ success: false, message: "transaction not found" });
    }

    // Convert type to match enum values
    const formattedType = type
      ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
      : oldTransaction.type;

    //update transaction
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      {
        amount: amount ? Number(amount) : oldTransaction.amount,
        description: description || oldTransaction.description,
        category: category || oldTransaction.category,
        type: formattedType,
        date: date ? new Date(date) : oldTransaction.date,
      },
      { new: true }
    );
    return res.json({ success: true, transaction: updatedTransaction });
  } catch (error) {
    console.error("transaction update error", error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    // Find and delete transaction
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "transaction not found",
      });
    }
    return res.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Transaction deletion error:", error);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
