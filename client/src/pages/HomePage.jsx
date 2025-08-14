import React, { useContext, useEffect, useState } from "react";
import { FcPlus } from "react-icons/fc";
import { IoMdHome } from "react-icons/io";
import { TbStairsUp } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "../../context/AuthContext";
import TransactionContext from "../../context/TransactionContext";
import TransactionList from "../components/TransactionList";
import ProfilePage from "./ProfilePage";

const HomePage = () => {
  const { authUser } = useContext(Authcontext);

  const { fetchRecentTransactions, statistics } =
    useContext(TransactionContext);
  const navigate = useNavigate();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the current date
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const day = currentDate.toLocaleString("default", { weekday: "long" });

  // Fetch recent transactions when the component mounts
  useEffect(() => {
    const loadRecentTransactions = async () => {
      setLoading(true);
      try {
        const transactions = await fetchRecentTransactions(5);
        setRecentTransactions(transactions);
      } catch (error) {
        console.error("Failed to fetch recent transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    if (authUser?._id) {
      loadRecentTransactions();
    }
  }, [fetchRecentTransactions, authUser?._id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfilePage />

      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <p className="text-sm text-gray-600">Current Balance</p>
          <h1 className="font-bold text-2xl text-gray-900">
            ${statistics.netBalance.toLocaleString()}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Income</p>
              <p className="text-green-600 font-semibold">
                +${statistics.totalIncome.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expenses</p>
              <p className="text-red-600 font-semibold">
                -${statistics.totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <TransactionList
            transactions={recentTransactions}
            loading={loading}
            title="Recent Transactions"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center py-2">
          <button className="p-2 text-gray-600 hover:text-blue-600">
            <IoMdHome className="text-2xl" />
          </button>
          <button
            onClick={() => navigate("/add")}
            className="p-2 text-gray-600 hover:text-blue-600"
          >
            <FcPlus className="text-3xl" />
          </button>
          <button
            onClick={() => navigate("/analysis")}
            className="p-2 text-gray-600 hover:text-blue-600"
          >
            <TbStairsUp className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
