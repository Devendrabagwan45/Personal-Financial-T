import React from "react";
import TransactionItem from "./TransactionItem";

const TransactionList = ({
  transactions,
  loading,
  error,
  title = "Transactions",
}) => {
  if (loading) {
    return (
      <div className="space-y-4 bg-black">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="  p-4 rounded-lg shadow animate-pulse">
            <div className="flex justify-between items-center">
              <div>
                <div className="h-4   rounded w-32 mb-2"></div>
                <div className="h-3  rounded w-24"></div>
              </div>
              <div className="h-4  rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <div className="bg-white/9 rounded-lg shadow overflow-hidden">
        <div className="hidden md:block">
          <table className="min-w-full ">
            <thead className="bg-black">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-black text-white">
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction._id}
                  transaction={transaction}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction._id}
              transaction={transaction}
              mobile
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
