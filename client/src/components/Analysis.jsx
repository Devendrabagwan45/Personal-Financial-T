import React, { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaChartLine,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import { MdOutlineFoodBank } from "react-icons/md";
import {
  FaHome,
  FaShoppingCart,
  FaCar,
  FaHeart,
  FaGamepad,
} from "react-icons/fa";
import {
  calculateDynamicStats,
  getSpendingInsights,
  formatCurrency,
  getTrendData,
} from "../lib/analysisUtils";
import CircularProgressBar from "./CircularProgressBar";
import TransactionContext from "../../context/TransactionContext";

const Analysis = () => {
  const { transactions } = useContext(TransactionContext);
  const navigate = useNavigate();

  const [timeFilter, setTimeFilter] = useState("week");
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate dynamic stats based on current data and filter
  const stats = useMemo(
    () => calculateDynamicStats(transactions, timeFilter),
    [transactions, timeFilter]
  );

  const insights = useMemo(() => getSpendingInsights(stats), [stats]);

  const trendData = useMemo(
    () => getTrendData(transactions, timeFilter),
    [transactions, timeFilter]
  );

  // Category icons mapping
  const categoryIcons = {
    Food: <MdOutlineFoodBank className="text-3xl" />,
    Housing: <FaHome className="text-3xl" />,
    Shopping: <FaShoppingCart className="text-3xl" />,
    Transport: <FaCar className="text-3xl" />,
    Health: <FaHeart className="text-3xl" />,
    Entertainment: <FaGamepad className="text-3xl" />,
  };

  const getCategoryIcon = (category) => {
    return categoryIcons[category] || <FaChartLine className="text-3xl" />;
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case "warning":
        return <FaExclamationTriangle className="text-yellow-500" />;
      case "info":
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  // Time filter options
  const timeFilters = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
    { value: "all", label: "All Time" },
  ];

  // Tab options
  const tabs = [
    { id: "overview", label: "Overview", icon: <FaChartLine /> },
    { id: "categories", label: "Categories", icon: <FaShoppingCart /> },
    { id: "trends", label: "Trends", icon: <FaChartLine /> },
    { id: "insights", label: "Insights", icon: <FaInfoCircle /> },
  ];

  // Render overview tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-xl shadow-lg">
          <h3 className="text-white text-sm font-medium">Total Income</h3>
          <p className="text-white text-2xl font-bold mt-2">
            {formatCurrency(stats.totalIncome)}
          </p>
          <p className="text-green-100 text-sm mt-1">+12% from last period</p>
        </div>

        <div className="bg-gradient-to-r from-red-400 to-red-600 p-6 rounded-xl shadow-lg">
          <h3 className="text-white text-sm font-medium">Total Expenses</h3>
          <p className="text-white text-2xl font-bold mt-2">
            {formatCurrency(stats.totalExpenses)}
          </p>
          <p className="text-red-100 text-sm mt-1">+8% from last period</p>
        </div>

        <div
          className={`p-6 rounded-xl shadow-lg ${
            stats.netBalance >= 0
              ? "bg-gradient-to-r from-blue-400 to-blue-600"
              : "bg-gradient-to-r from-orange-400 to-orange-600"
          }`}
        >
          <h3 className="text-white text-sm font-medium">Net Balance</h3>
          <p className="text-white text-2xl font-bold mt-2">
            {formatCurrency(stats.netBalance)}
          </p>
          <p className="text-white text-sm mt-1">
            {stats.netBalance >= 0 ? "Profit" : "Loss"}
          </p>
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Transaction Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">
              {stats.transactionCount}
            </p>
            <p className="text-sm text-gray-600">Total Transactions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">
              {formatCurrency(stats.averageTransaction)}
            </p>
            <p className="text-sm text-gray-600">Avg Transaction</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalIncome / 30)}
            </p>
            <p className="text-sm text-gray-600">Daily Average</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalExpenses / 30)}
            </p>
            <p className="text-sm text-gray-600">Daily Spending</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render categories tab
  const renderCategories = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Spending by Category</h3>

      {stats.topCategories.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-xl text-center">
          <p className="text-gray-500">No category data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {stats.topCategories.map((category, index) => (
            <div
              key={category.category}
              className="bg-white p-4 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getCategoryIcon(category.category)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{category.category}</h4>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(category.amount)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{category.percentage}%</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render trends tab
  const renderTrends = () => {
    const trendEntries = Object.entries(trendData);

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4">Spending Trends</h3>

        {trendEntries.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-xl text-center">
            <p className="text-gray-500">No trend data available</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="space-y-4">
              {trendEntries.map(([period, amount]) => (
                <div key={period} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{period}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (amount /
                              Math.max(...trendEntries.map(([, a]) => a))) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render insights tab
  const renderInsights = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Financial Insights</h3>

      {insights.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-xl text-center">
          <p className="text-gray-500">No insights available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-l-4 ${
                insight.type === "warning"
                  ? "bg-yellow-50 border-yellow-400"
                  : "bg-blue-50 border-blue-400"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getInsightIcon(insight.type)}
                </div>
                <div>
                  <p className="font-medium">{insight.message}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Severity: {insight.severity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional Recommendations */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl text-white">
        <h4 className="font-semibold mb-2">Smart Recommendations</h4>
        <ul className="space-y-2 text-sm">
          <li>• Track your spending daily to stay within budget</li>
          <li>• Set up automatic savings for consistent growth</li>
          <li>• Review and categorize transactions regularly</li>
          <li>• Use insights to adjust spending habits</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <h1 className="ml-4 text-xl font-semibold">Financial Analysis</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {timeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTimeFilter(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeFilter === filter.value
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "categories" && renderCategories()}
          {activeTab === "trends" && renderTrends()}
          {activeTab === "insights" && renderInsights()}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
