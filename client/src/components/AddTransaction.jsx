import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionContext from "../../context/TransactionContext";
import { Authcontext } from "../../context/AuthContext";

const AddTransaction = () => {
  const navigate = useNavigate();
  const { addTransaction } = useContext(TransactionContext);
  const { authUser } = useContext(Authcontext);

  const [currState, setCurrState] = useState("Expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categoryOrSource, setCategoryOrSource] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    const transaction = {
      userId: authUser?._id,
      amount: parsedAmount,
      description: description || "No description",
      type: currState,
      date: new Date().toISOString(),
      category: currState === "Expense" ? category : categoryOrSource,
    };
    console.log("Transaction:", transaction);

    addTransaction(transaction); //call context function

    // Reset form fields
    setAmount("");
    setDescription("");
    setCategory("");
    setCurrState("Expense");
    setError(""); // Clear any previous errors

    navigate(-1); // Navigate back after adding
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4 ">
        <h1 className="text-2xl font-bold ml-10">Add Transaction</h1>
        <span
          onClick={() => navigate(-1)}
          className="cursor-pointer text-blue-600"
        >
          Cancel
        </span>
      </div>

      <div className="flex justify-between items-center p-4 mx-10 border rounded-4xl mt-4 bg-gray-100 shadow-lg">
        <h1
          className={`cursor-pointer p-3 transition duration-300 ease-in-out ${
            currState === "Expense"
              ? "font-bold bg-blue-600 rounded-full text-white text-2xl"
              : "text-blue-600 hover:bg-blue-200 rounded-full"
          }`}
          onClick={() => setCurrState("Expense")}
        >
          Expense
        </h1>
        <h1
          className={`cursor-pointer p-3 transition duration-300 ease-in-out ${
            currState === "Income"
              ? "font-bold bg-blue-600 rounded-full text-white text-2xl"
              : "text-blue-600 hover:bg-blue-200 rounded-full"
          }`}
          onClick={() => setCurrState("Income")}
        >
          Income
        </h1>
      </div>

      <h2 className="text-xl font-semibold text-center my-4">
        Transaction Details
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 "
      >
        <label className="block mb-2">
          Amount
          <input
            type="text"
            placeholder="$0.00"
            className="block border border-gray-300 rounded-md p-2 mb-4 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        {currState === "Expense" ? (
          <label className="block mb-2">
            Category
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="block border border-gray-300 rounded-md p-2 mb-4 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </select>
          </label>
        ) : (
          <label className="block mb-2">
            Source of Income
            <input
              type="text"
              placeholder="e.g., Salary, Freelance"
              className="block border border-gray-300 rounded-md p-2 mb-4 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={categoryOrSource}
              onChange={(e) => setCategoryOrSource(e.target.value)}
            />
          </label>
        )}

        <label className="block mb-2">
          Description (optional)
          <input
            type="text"
            placeholder="Optional details"
            className="block w-full border border-gray-300 rounded-md p-2 mb-4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
