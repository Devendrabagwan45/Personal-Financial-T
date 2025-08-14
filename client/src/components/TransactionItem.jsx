import React from "react";
import { formatCurrency, formatDate } from "../lib/utils";

const TransactionItem = ({ transaction, mobile = false }) => {
  const isIncome = transaction.type === "Income";
  const amountColor = isIncome ? "text-green-600" : "text-red-600";
  const amountPrefix = isIncome ? "+" : "-";

  const getCategoryIcon = (category) => {
    const icons = {
      "Food & Dining": "🍔",
      Transportation: "🚗",
      Shopping: "🛍️",
      Entertainment: "🎬",
      "Bills & Utilities": "💡",
      Healthcare: "🏥",
      Education: "📚",
      Salary: "💰",
      Investment: "📈",
      Other: "📋",
    };
    return icons[category] || "📋";
  };

  if (mobile) {
    return (
      <div className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {getCategoryIcon(transaction.category)}
              </span>
              <div>
                <p className="font-medium text-gray-900">
                  {transaction.description}
                </p>
                <p className="text-sm text-gray-500">{transaction.category}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(transaction.date)}
            </p>
          </div>
          <div className="text-right">
            <p className={`font-semibold ${amountColor}`}>
              {amountPrefix}
              {formatCurrency(transaction.amount)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <span className="text-lg">
              {getCategoryIcon(transaction.category)}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {transaction.description}
            </div>
            <div className="text-sm text-gray-500">{transaction.category}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {transaction.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(transaction.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <span className={`${amountColor} font-semibold`}>
          {amountPrefix}
          {formatCurrency(transaction.amount)}
        </span>
      </td>
    </tr>
  );
};

export default TransactionItem;
