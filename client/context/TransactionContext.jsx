import axios from "axios";
import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { Authcontext } from "./AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;
const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
  });

  // Get auth context
  const { authUser } = useContext(Authcontext);

  // Fetch all transactions - memoized with useCallback
  const fetchTransactions = useCallback(async () => {
    if (!authUser?._id) {
      setError("User  not authenticated");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `/api/transactions/getTransactions?page=${currentPage}&filter=${filter}`,
        {
          headers: {
            token: token,
          },
        }
      );
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);

      // Calculate statistics
      let totalIncome = 0;
      let totalExpenses = 0;
      data.transactions.forEach((transaction) => {
        if (transaction.type === "Income") {
          totalIncome += transaction.amount;
        } else if (transaction.type === "Expense") {
          totalExpenses += transaction.amount;
        }
      });
      setStatistics({
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
      });
      setError(null);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch transactions: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [authUser?._id, currentPage, filter]);

  // Fetch recent transactions - memoized with useCallback
  const fetchRecentTransactions = useCallback(
    async (limit = 10) => {
      if (!authUser?._id) {
        setError("User  not authenticated");
        return [];
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `/api/transactions/recent?limit=${limit}`,
          {
            headers: {
              token: token,
            },
          }
        );
        return data.transactions;
      } catch (error) {
        setError(error.message);
        toast.error("Failed to fetch recent transactions: " + error.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [authUser?._id]
  );

  // Add a new transaction
  const addTransaction = async (transaction) => {
    try {
      const token = localStorage.getItem("token");

      if (!authUser?._id) {
        throw new Error("User  not authenticated");
      }

      const { data: newTransaction } = await axios.post(
        "/api/transactions/addTransaction",
        { ...transaction, userId: authUser._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions((prev) => [newTransaction.transaction, ...prev]);

      // Update statistics
      if (newTransaction.transaction.type === "Income") {
        setStatistics((prev) => ({
          ...prev,
          totalIncome: prev.totalIncome + newTransaction.transaction.amount,
          netBalance: prev.netBalance + newTransaction.transaction.amount,
        }));
      } else {
        setStatistics((prev) => ({
          ...prev,
          totalExpenses: prev.totalExpenses + newTransaction.transaction.amount,
          netBalance: prev.netBalance - newTransaction.transaction.amount,
        }));
      }
      toast.success("Transaction added successfully!");
      return newTransaction.transaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error(error.response?.data?.message || "Failed to add transaction");
      throw error;
    }
  };

  // Update existing transaction
  const updateTransaction = async (id, updates) => {
    try {
      const token = localStorage.getItem("token");

      const { data: updatedTransaction } = await axios.put(
        `/api/transactions/updateTransaction/${id}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === id ? updatedTransaction : tx))
      );
      toast.success("Transaction updated successfully!");
      return updatedTransaction;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/transactions/deleteTransaction/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      toast.success("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  };

  // Filter transactions by type
  const filteredTransactions = () => {
    switch (filter) {
      case "income":
        return transactions.filter((tx) => tx.type === "Income");
      case "expense":
        return transactions.filter((tx) => tx.type === "Expense");
      default:
        return transactions;
    }
  };

  // Context value
  const value = {
    transactions: filteredTransactions(),
    loading,
    error,
    statistics,
    filter,
    currentPage,
    totalPages,
    fetchRecentTransactions,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilter,
    setCurrentPage,
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // Only call fetchTransactions when it changes

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

// Export the context and a custom hook for using the context
export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider"
    );
  }
  return context;
};

export default TransactionContext;
