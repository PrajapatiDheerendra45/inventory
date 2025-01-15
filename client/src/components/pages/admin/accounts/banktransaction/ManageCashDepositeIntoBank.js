import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageCashDepositeIntoBank = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const API_BASE = "/api/v1/auth/deposits";
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`; // Returns in YYYY-MM-DD format
  };
  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(API_BASE);
      setTransactions(data.data || []);
      console.log(data,"data")
    } catch (error) {
      toast.error("Error fetching transactions");
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      toast.success("Transaction deleted successfully");
      fetchTransactions();
    } catch (error) {
      toast.error("Error deleting transaction");
    }
  };

  // Update transaction
  const handleUpdateTransaction = async (updatedData) => {
    try {
      await axios.put(`${API_BASE}/${selectedTransaction._id}`, updatedData);
      toast.success("Transaction updated successfully");
      setShowUpdateModal(false);
      fetchTransactions();
    } catch (error) {
      toast.error("Error updating transaction");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className=" responsive-container p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Cash Deposite Into Bank</h2>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Contra No</th>
              <th className="border border-gray-300 px-4 py-2">From Account</th>
              <th className="border border-gray-300 px-4 py-2">To Account</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction._id} className="even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">
                {formatDate(transaction.date)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.contraNo}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.fromAccount}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.toAccount}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.amount}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2 mb-2"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowViewModal(true);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2 mb-2"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowUpdateModal(true);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => deleteTransaction(transaction._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {showViewModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">View Transaction</h3>
            <p><strong>Date:</strong> {formatDate(selectedTransaction?.date)}</p>
            <p><strong>Contra No:</strong> {selectedTransaction?.contraNo}</p>
            <p><strong>From Account:</strong> {selectedTransaction?.fromAccount}</p>
            <p><strong>To Account:</strong> {selectedTransaction?.toAccount}</p>
            <p><strong>Amount:</strong> {selectedTransaction?.amount}</p>
            <button
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setShowViewModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Update Transaction</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedData = {
                  date: e.target.date.value,
                  contraNo: e.target.contraNo.value,
                  fromAccount: e.target.fromAccount.value,
                  toAccount: e.target.toAccount.value,
                  amount: e.target.amount.value,
                };
                handleUpdateTransaction(updatedData);
              }}
            >
              <div className="mb-4">
                <label className="block font-semibold">Date</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={formatDate(selectedTransaction?.date)} // Here we format the date for the input
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold">Contra No</label>
                <input
                  type="text"
                  name="contraNo"
                  defaultValue={selectedTransaction?.contraNo}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold">From Account</label>
                <input
                  type="text"
                  name="fromAccount"
                  defaultValue={selectedTransaction?.fromAccount}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold">To Account</label>
                <input
                  type="text"
                  name="toAccount"
                  defaultValue={selectedTransaction?.toAccount}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold">Amount</label>
                <input
                  type="number"
                  name="amount"
                  defaultValue={selectedTransaction?.amount}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </form>
            <button
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setShowUpdateModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCashDepositeIntoBank;
