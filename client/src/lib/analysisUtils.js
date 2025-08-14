// Dynamic analysis utilities for transaction data

export const calculateDynamicStats = (transactions, timeFilter = "all") => {
  const now = new Date();
  let filteredTransactions = transactions;

  // Apply time filter
  if (timeFilter !== "all") {
    const cutoffDate = new Date();
    switch (timeFilter) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    filteredTransactions = transactions.filter(
      (t) => new Date(t.date) >= cutoffDate
    );
  }

  // Calculate basic stats
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Category analysis
  const categorySpending = {};
  filteredTransactions
    .filter((t) => t.type === "Expense")
    .forEach((t) => {
      categorySpending[t.category] =
        (categorySpending[t.category] || 0) + t.amount;
    });

  // Convert to array and sort by amount
  const topCategories = Object.entries(categorySpending)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage:
        totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Daily spending pattern
  const dailySpending = {};
  filteredTransactions
    .filter((t) => t.type === "Expense")
    .forEach((t) => {
      const date = new Date(t.date).toLocaleDateString("en-US", {
        weekday: "short",
      });
      dailySpending[date] = (dailySpending[date] || 0) + t.amount;
    });

  // Monthly trend
  const monthlyTrend = {};
  filteredTransactions
    .filter((t) => t.type === "Expense")
    .forEach((t) => {
      const month = new Date(t.date).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      monthlyTrend[month] = (monthlyTrend[month] || 0) + t.amount;
    });

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    topCategories,
    dailySpending,
    monthlyTrend,
    transactionCount: filteredTransactions.length,
    averageTransaction:
      filteredTransactions.length > 0
        ? (totalExpenses + totalIncome) / filteredTransactions.length
        : 0,
  };
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return (((current - previous) / Math.abs(previous)) * 100).toFixed(1);
};

// Get spending insights
export const getSpendingInsights = (stats) => {
  const insights = [];

  if (stats.totalExpenses > stats.totalIncome * 0.8) {
    insights.push({
      type: "warning",
      message: "Your expenses are approaching 80% of your income",
      severity: "high",
    });
  }

  if (
    stats.topCategories.length > 0 &&
    stats.topCategories[0].percentage > 50
  ) {
    insights.push({
      type: "info",
      message: `${stats.topCategories[0].category} is your biggest expense category`,
      severity: "medium",
    });
  }

  if (stats.transactionCount === 0) {
    insights.push({
      type: "info",
      message: "No transactions found for the selected period",
      severity: "low",
    });
  }

  return insights;
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Get trend data for charts
export const getTrendData = (transactions, period = "week") => {
  const trend = {};
  const now = new Date();

  transactions
    .filter((t) => t.type === "Expense")
    .forEach((t) => {
      const date = new Date(t.date);
      let key;

      switch (period) {
        case "week":
          key = date.toLocaleDateString("en-US", { weekday: "short" });
          break;
        case "month":
          key = date.getDate().toString();
          break;
        case "year":
          key = date.toLocaleDateString("en-US", { month: "short" });
          break;
      }

      trend[key] = (trend[key] || 0) + t.amount;
    });

  return trend;
};
