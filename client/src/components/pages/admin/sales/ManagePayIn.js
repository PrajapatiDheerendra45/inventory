import React, { useEffect, useState } from "react";
import { MdRateReview, MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import axios from "axios";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../../../context/Auth";

const ManagePayIn = () => {
  const [payIns, setPayIns] = useState([]);
  const [selectedPayIn, setSelectedPayIn] = useState(null);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [Narration, setNarration] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [receiptMode, setReceiptMode] = useState("Cash");
  const [selectBank, setSelectBank] = useState("");
  const [method, setMethod] = useState("");
  const [transactionCheckNo, setTransactionCheckNo] = useState("Cash");

  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [date, setDate] = useState("");
  const [auth] = useAuth();
  const [userId, setUserId] = useState("");
  
  const [selctedCustomerInvoiceData, setSelctedCustomerInvoiceData] = useState(
    []
  );

  const [rows, setRows] = useState([
    {
      id: 1,
      billNo: "",
      billAmount: "",
      paidAmount: "",
      recievedAmount: "",
      balanceAmount: "",
    },
  ]);

  // Add new states for method and transactionCheckNo

  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id);
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin);
    }
   fetchPayIns();
    fetchCustomer();
  }, [auth,userId]);

    const fetchPayIns = async () => {
      try {
        const response = await axios.get(`/api/v1/payInRoute/getAllpayin/${userId}`);
        setPayIns(response.data.payInList);
      } catch (error) {
        console.error("Error fetching PayIns:", error);
        toast.error("Error fetching records");
      }
    };
  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageCustomer/${userId}`);
      setCustomer(response.data.data);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  const salesinvoicesCustomerByName = async (selectedCustomer) => {
    try {
      const response = await axios.get(
        `/api/v1/salesInvoiceRoute/salesinvoicesByName/${selectedCustomer}`
      );
      setSelctedCustomerInvoiceData(response.data.response);
    } catch (error) {
      console.error("Error fetching customer invoices:", error);
    }
  };

  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value);
    salesinvoicesCustomerByName(e.target.value); // This should be called when customer changes
  };

  const handleRowChange = (index, key, value) => {
    const newRows = [...rows];
    newRows[index][key] = value;

    if (key === "billNo") {
      const selectedInvoice = selctedCustomerInvoiceData.find(
        (item) => item.InvoiceNo === value
      );
      if (selectedInvoice) {
        const paymentData = selectedInvoice.cash
          ? selectedInvoice.cash
          : selectedInvoice.bank;
        newRows[index] = {
          ...newRows[index],
          billNo: selectedInvoice.InvoiceNo,
          billAmount: selectedInvoice.netAmount,
          paidAmount: paymentData ? paymentData.Received : 0,
        };
      }
    }

    setRows(newRows); // Update rows state
  };

  let grandtotal = 0;
  const calculateBalance = (billAmount, paidAmount, receivedAmount) => {
    const bill = parseFloat(billAmount) || 0;
    const credit = parseFloat(paidAmount) || 0;
    const received = parseFloat(receivedAmount) || 0;
    grandtotal += bill - credit - received;
    return (bill - credit - received).toFixed(2);
  };

  let alltotal = 0;
  const GrandTotal = (billAmount, paidAmount, receivedAmount) => {
    const bill = parseFloat(billAmount) || 0;
    const credit = parseFloat(paidAmount) || 0;
    const received = parseFloat(receivedAmount) || 0;
    alltotal += bill - credit - received;
    return alltotal;
  };
  const calculateTotalReceived = () => {
    return rows
      .reduce((total, row) => {
        return total + parseFloat(row.recievedAmount || 0);
      }, 0)
      .toFixed(2);
  };

  // Fetch all payIn records
  

  // Open view modal
  const openViewModal = (payIn) => {
    setSelectedPayIn(payIn);
    setViewModalIsOpen(true);
  };

  // Open edit modal
  // Open edit modal
  const openEditModal = (payIn) => {
    setSelectedPayIn(payIn);
    setNarration(payIn.Narration || "");
    setRows(payIn.rows ? [...payIn.rows] : []); // Ensure deep copy
    setDate(payIn.date.split("T")[0] || "");
    setReceiptNo(payIn.receiptNo || "");
    setReceiptMode(payIn.receiptMode || "Cash");
    setSelectBank(payIn.selectBank || "");
    setMethod(payIn.method || "");
    setTransactionCheckNo(payIn.transactionCheckNo || "");
    setSelectedCustomer(payIn.selectCustomer || ""); // Add this line to set the customer correctly

    setEditModalIsOpen(true);
  };

  // Calculate or fetch the total received amount

  // Close modals
  const closeModals = () => {
    setViewModalIsOpen(false);
    setEditModalIsOpen(false);
    setSelectedPayIn(null);
  };

  useEffect(() => {
    // Fetch invoice data only if a customer is already selected
    if (selectedCustomer) {
      salesinvoicesCustomerByName(selectedCustomer);
    }
  }, [selectedCustomer]); // This will run when `selectedCustomer` changes

  const calculateTotalReceivedAmount = () => {
    if (selectedPayIn) {
      return selectedPayIn.rows.reduce((total, row) => {
        const receivedAmount = parseFloat(row.recievedAmount) || 0;
        return total + receivedAmount;
      }, 0);
    }
    return 0;
  };


  const handleSaveEdit = async () => {
    try {

      const updatedRows = rows?.map((row) => {
        // Remove _id if it's a new entry or invalid
        if (!row._id || typeof row._id === "number") {
          const { _id, ...rest } = row;
          return rest;
        }
        return row;
      });

      const updatedPayIn = {
        ...selectedPayIn,
        Narration: Narration,
        grandtotal: calculateTotalReceivedAmount(),
        rows: updatedRows,
        selectCustomer: selectedCustomer, // Ensure the selected customer is included in the update
      };

      const res = await axios.put(
        `/api/v1/payInRoute/updatepayin/${updatedPayIn._id}`,
        updatedPayIn
      );

      toast.success("Record updated successfully");
      console.log(res, "sdkjfk");

      // Close the modal
      closeModals();

      // Refresh the data list
      const response = await axios.get("/api/v1/payInRoute/getAllpayin");
      setPayIns(response.data.payInList);
    } catch (error) {
      toast.error("Error updating record");
      console.error("Error updating record:", error);
    }
  };

  // Add a new row
  const addRow = () => {
    setRows([
      ...rows,
      {
        _id: Math.random(),
        billNo: "",
        billAmount: "",
        receivedAmount: "",
        balanceAmount: "",
      },
    ]);
  };

  const removeRow = (index) => {
    setRows(rows?.filter((_, rowIndex) => rowIndex !== index));
  };

  // Delete a PayIn
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`/api/v1/payInRoute/deletePayIn/${id}`);
        toast.success("Record deleted successfully");
        setPayIns(payIns?.filter((payIn) => payIn._id !== id));
      } catch (error) {
        toast.error("Error deleting record");
        console.error("Error deleting record:", error);
      }
    }
  };

  return (
    <div
      style={{ padding: "0px", backgroundColor: "#FFFFFF" }}
      className="responsive-container overflow-y-auto"
    >
      <ToastContainer />
      <h1 className="text-center text-3xl mt-3 mb-10">Manage Pay In</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-black border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-black">#</th>
              <th className="px-4 py-2 border text-black">Date</th>
              <th className="px-4 py-2 border text-black">Receipt No.</th>
              <th className="px-4 py-2 border text-black">Customer Name</th>
              <th className="px-4 py-2 border text-black">Receipt Mode</th>
              <th className="py-2 border text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            {payIns?.map((payIn, index) => (
              <tr key={payIn._id}>
                <td className="px-4 py-2 border text-black">{index + 1}</td>
                <td className="px-4 py-2 border text-black">
                  {payIn.date.split("T")[0]}
                </td>
                <td className="px-4 py-2 border text-black">
                  {payIn.receiptNo}
                </td>
                <td className="px-4 py-2 border text-black">
                  {payIn.selectCustomer}
                </td>
                <td className="px-4 py-2 border text-black">
                  {payIn.receiptMode}
                </td>
                <td className="px-4 py-2 border text-black">
                  <button
                    onClick={() => openViewModal(payIn)}
                    className="mx-1 text-black bg-green-500 rounded p-2"
                  >
                    <MdRateReview className="text-xl" />
                  </button>
                  <button
                    onClick={() => openEditModal(payIn)}
                    className="mx-1 text-black bg-blue-500 pl-3 pr-3 p-1 rounded"
                  >
                    <FiEdit className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleDelete(payIn._id)}
                    className="mx-1 text-black bg-red-500 pl-3 pr-3 p-1 rounded"
                  >
                    <MdDelete className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPayIn && (
        <Modal
          isOpen={viewModalIsOpen}
          onRequestClose={closeModals}
          contentLabel="View Pay In"
          className="modal overflow-x-auto"
          style={{
            content: {
              width: "100%",
              height: "100%",
              maxWidth: "800px",
              margin: "auto",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              backgroundColor: "#fff", // Set the background color to black (or any color you prefer)
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: dim the background overlay
            },
          }}
        >
          <h2 className="text-2xl text-center font-bold">Pay Out Details</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col">
              <label className="text-md font-bold text-black">Date</label>
              <input
                type="date"
                value={selectedPayIn.date}
                readOnly
                className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md font-bold text-black">
                Receipt No.
              </label>
              <input
                type="text"
                value={selectedPayIn.receiptNo}
                readOnly
                className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md font-bold text-black">
                Customer Name
              </label>
              <input
                type="text"
                value={selectedPayIn.selectCustomer}
                readOnly
                className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md font-bold text-black">
                Receipt Mode
              </label>
              <input
                type="text"
                value={selectedPayIn.receiptMode}
                readOnly
                className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
              />
            </div>
          </div>

          {selectedPayIn.receiptMode === "Bank" && (
            <>
              <div className="grid grid-cols-3 gap-5">
                {" "}
                <div className="flex flex-col mt-4">
                  <label className="text-md font-bold text-black">
                    Select Bank
                  </label>
                  <input
                    type="text"
                    value={selectedPayIn.selectBank}
                    readOnly
                    className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <label className="text-md font-bold text-black">Method</label>
                  <input
                    type="text"
                    value={selectedPayIn.method}
                    readOnly
                    className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <label className="text-md font-bold text-black">
                    Transaction / Cheque No
                  </label>
                  <input
                    type="text"
                    value={transactionCheckNo}
                    onChange={(e) => setTransactionCheckNo(e.target.value)}
                    className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
                  />
                </div>
              </div>
            </>
          )}

          <h3 className="text-lg font-bold mt-4">Bill Details:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-black mt-2">
              <thead>
                <tr className="bg-green-600">
                  <th className="px-4 py-2 border text-black">Bill No.</th>
                  <th className="px-4 py-2 border text-black">Bill Amount</th>
                  <th className="px-4 py-2 border text-black">Paid Amount</th>
                  <th className="px-4 py-2 border text-black">
                    Received Amount
                  </th>
                  <th className="px-4 py-2 border text-black">
                    Balance Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedPayIn?.rows.map((row) => (
                  <tr className="text-black" key={row._id}>
                    <td className="px-4 py-2 border">{row.billNo}</td>
                    <td className="px-4 py-2 border">{row.billAmount}</td>
                    <td className="px-4 py-2 border">{row.paidAmount}</td>
                    <td className="px-4 py-2 border">{row.recievedAmount}</td>
                    <td className="px-4 py-2 border">{row.balanceAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-row justify-end items-center gap-5  mt-10">
              <label className="text-1xl font-bold text-black mr-2">
                Total
              </label>
              <input
                type="text"
                value={selectedPayIn.grandtotal}
                readOnly
                className="p-1 border border-gray-500 w-1/2 rounded-md bg-gray-200"
              />
            </div>
            <div className="flex flex-row justify-left gap-5 mt-10">
              <label className="text-2xl font-bold text-black mr-2 mt-3">
                Narration
              </label>
              <textarea
                type="text"
                className="p-1 border border-gray-500 w-1/2 rounded-md bg-gray-200"
                value={selectedPayIn.Narration}
              />
            </div>
          </div>

          <button
            onClick={closeModals}
            className="mt-4 p-2 bg-blue-500 text-black rounded"
          >
            Close
          </button>
        </Modal>
      )}
      {/* Edit Modal */}
      {selectedPayIn && (
        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={closeModals}
          contentLabel="Edit Pay In"
          className="modal overflow-y-auto"
          style={{
            content: {
              width: "100%",
              height: "100%",
              maxWidth: "800px",
              margin: "auto",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              backgroundColor: "#fff",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <h2 className="text-2xl text-center font-bold">Edit Pay In</h2>

          <div
            style={{ backgroundColor: "#FFFFFF" }}
            className="responsive-container bg-pink-200 p-4 rounded-md w-full mx-auto"
          >
            <h1 className="text-center text-3xl  text-black mb-5 cucolor">
              Pay In
            </h1>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-md font-bold text-black">Date</label>
                <input
                  type="date"
                  className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-md font-bold text-black">
                  Receipt No.
                </label>
                <input
                  type="text"
                  className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-md font-bold text-black">
                  Select Customer
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={selectedCustomer}
                  onChange={handleCustomerChange}
                >
                  <option value="">Select Customer</option>
                  {customer?.map((customer) => (
                    <option key={customer._id} value={customer.name}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-md font-bold text-black">
                  Receipt Mode
                </label>
                <select
                  value={receiptMode}
                  onChange={(e) => setReceiptMode(e.target.value)}
                  className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                </select>
              </div>

              {receiptMode === "Bank" && (
                <>
                  <div className="flex flex-col">
                    <label className="text-md font-bold text-black">
                      Select Bank
                    </label>
                    <select
                      value={selectBank}
                      onChange={(e) => setSelectBank(e.target.value)}
                      className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
                    >
                      <option value="">Select Bank</option>
                      <option value="Bank1">Bank1</option>
                      <option value="Bank2">Bank2</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-md font-bold text-black">
                      Method
                    </label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
                    >
                      <option value="">Select Method</option>
                      <option value="Online">Online</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-md font-bold text-black">
                      Transaction / Cheque No
                    </label>
                    <input
                      type="text"
                      value={transactionCheckNo}
                      onChange={(e) => setTransactionCheckNo(e.target.value)}
                      className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="overflow-x-auto mt-5">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-500 p-1">#</th>
                    <th className="border border-gray-500 p-1">Bill NO</th>
                    <th className="border border-gray-500 p-1">Bill Amount</th>
                    <th className="border border-gray-500 p-1">
                      Credit Amount
                    </th>
                    <th className="border border-gray-500 p-1">
                      Received Amount
                    </th>
                    <th className="border border-gray-500 p-1">
                      Balance Amount
                    </th>
                    <th className="border border-gray-500 p-1">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {rows?.map((row, index) => (
                    <tr key={row.id}>
                      <td className="border border-gray-500 p-1 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-500 p-1">
                        <select
                          value={row.billNo}
                          onChange={(e) =>
                            handleRowChange(index, "billNo", e.target.value)
                          }
                          className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option className="text-black">Select</option>
                          {selctedCustomerInvoiceData?.map((item, idx) => (
                            <option key={idx} value={item.InvoiceNo}>
                              {item.InvoiceNo ? item.InvoiceNo : "NA"}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border border-gray-500 p-1">
                        {row.billAmount || "NA"}
                      </td>
                      <td className="border border-gray-500 p-1">
                        {row.paidAmount || "NA"}
                      </td>
                      <td className="border border-gray-500 p-1">
                        <input
                          type="text"
                          value={row.recievedAmount || ""}
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "recievedAmount",
                              e.target.value
                            )
                          }
                          className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-500 p-1">
                        {calculateBalance(
                          row.billAmount,
                          row.paidAmount,
                          row.recievedAmount
                        )}
                      </td>
                      <td className="text-center flex gap-2 pl-1">
                        <button
                          onClick={addRow}
                          className="p-2 bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Add row"
                        >
                          <AiOutlinePlus className="h-5 w-4 text-white" />
                        </button>
                        <button
                          onClick={() => removeRow(index)}
                          className="p-2 bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Remove row"
                        >
                          <AiOutlineClose className="h-5 w-4 text-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-gray-500 p-1 text-right font-bold"
                    >
                      Total Received Amount:
                    </td>
                    <td className="border border-gray-500 p-1 font-bold">
                      {calculateTotalReceived()}
                    </td>
                    <td className="border border-gray-500 p-1"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex flex-row justify-end items-center gap-5 lg:mr-28 mt-10">
              <label className="text-2xl font-bold text-black mr-2">
                Total
              </label>
              <input
                type="text"
                value={grandtotal.toFixed(2)}
                readOnly
                className="p-1 border border-gray-500 w-1/2 rounded-md bg-gray-200"
              />
            </div>
            <div className="flex flex-row justify-left gap-5 mt-10">
              <label className="text-2xl font-bold text-black mr-2">
                Narration
              </label>
              <textarea
                type="text"
                className="p-1 border border-gray-500 w-1/2 rounded-md bg-gray-200"
                value={Narration}
                onChange={(e) => setNarration(e.target.value)}
              />
            </div>
            <div className="text-center mt-8">
              <button
                onClick={handleSaveEdit}
                className="bg-black text-white py-2 px-16 rounded text-xl font-bold hover:bg-gray-700"
              >
                Save
              </button>
            </div>
            <ToastContainer />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManagePayIn;

