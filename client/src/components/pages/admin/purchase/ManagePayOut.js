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
  const [paymentNo, setpaymentNo] = useState("");
  const [paymentMode, setpaymentMode] = useState("Cash");
  const [selectBank, setSelectBank] = useState("");
  const [method, setMethod] = useState("");
  const [transactionCheckNo, setTransactionCheckNo] = useState("Cash");

  const [supplier, setsupplier] = useState([]);
  const [supplierName, setsupplierName] = useState("");
  const [date, setDate] = useState("");

  const [selctedsupplierInvoiceData, setSelctedsupplierInvoiceData] = useState(
    []
  );
  const [auth] = useAuth();
  const [userId, setUserId] = useState("");
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
    fetchsupplier();
  }, []);
  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id);
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin);
    }

  }, [auth, userId]);

  const fetchsupplier = async () => {
    try {
      const response = await axios.get("/api/v1/auth/managesupplier");
      setsupplier(response.data.data);
    } catch (error) {
      console.error("Error fetching supplier:", error);
    }
  };

  const salesinvoicessupplierByName = async (selctedsupplierInvoiceData) => {
    try {
      const response = await axios.get(
        `/api/v1/purchaseInvoiceRoute/purchaseinvoicesByName/${selctedsupplierInvoiceData}`
      );
     
      setSelctedsupplierInvoiceData(response.data.response);
    } catch (error) {
      console.error("Error fetching supplier invoices:", error);
    }
  };

  const handlesupplierChange = (e) => {
    setsupplierName(e.target.value);
    salesinvoicessupplierByName(e.target.value); // This should be called when supplier changes
  };

  const handleRowChange = (index, key, value) => {
    const newRows = [...rows];
    newRows[index][key] = value;

    if (key === "billNo") {
      const selectedInvoice = selctedsupplierInvoiceData.find(
        (item) => item.invoiceNo === value
      );
      if (selectedInvoice) {
        const paymentData = selectedInvoice.cash
          ? selectedInvoice.cash
          : selectedInvoice.bank;
        newRows[index] = {
          ...newRows[index],
          billNo: selectedInvoice.invoiceNo,
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

    const fetchPayIns = async () => {
      try {
        const response = await axios.get(`/api/v1/PayOutRoute/getAllpayout/${userId}`);
        setPayIns(response.data.payOutList);
      } catch (error) {
        console.error("Error fetching PayIns:", error);
        toast.error("Error fetching records");
      }
    };

    useEffect(() => {
      if (auth.user.role === 1) {
        setUserId(auth.user._id);
      }
      if (auth.user.role === 0) {
        setUserId(auth.user.admin);
      }
      fetchPayIns();
  }, [auth,userId]);

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
    setpaymentNo(payIn.paymentNo || "");
    setpaymentMode(payIn.paymentMode || "Cash");
    setSelectBank(payIn.selectBank || "");
    setMethod(payIn.method || "");
    setTransactionCheckNo(payIn.transactionCheckNo || "");
    setsupplierName(payIn.supplierName || ""); // Add this line to set the supplier correctly

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
    // Fetch invoice data only if a supplier is already selected
    if (supplierName) {
      salesinvoicessupplierByName(supplierName);
    }
  }, [supplierName]); // This will run when `supplierName` changes

  const calculateTotalReceivedAmount = () => {
    if (selectedPayIn) {
      return selectedPayIn.rows.reduce((total, row) => {
        const receivedAmount = parseFloat(row.recievedAmount) || 0;
        return total + receivedAmount;
      }, 0);
    }
    return 0;
  };

  // Save changes after edit
  // Save changes and close the modal without submitting the form
  // Save changes after edit
  const handleSaveEdit = async () => {
    try {
      // Include Narration and total in the selectedPayIn object before saving

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
        supplierName: supplierName, // Ensure the selected supplier is included in the update
      };

      const res = await axios.put(
        `/api/v1/payOutRoute/updatepayout/${updatedPayIn._id}`,
        updatedPayIn
      );

      toast.success("Record updated successfully");
    

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

  // Modify the removeRow function to use the index
  const removeRow = (index) => {
    setRows(rows.filter((_, rowIndex) => rowIndex !== index));
  };

  // Delete a PayIn
  const handleDelete = async (_id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
       
        await axios.delete(`/api/v1/PayOutRoute/deletepayout/${_id}`);
        toast.success("Record deleted successfully");
        setPayIns(payIns.filter((payIn) => payIn._id !== _id));
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
      <h1 className="text-center text-3xl mt-3 mb-10">Manage Pay Out</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-black border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-black">#</th>
              <th className="px-4 py-2 border text-black">Date</th>
              <th className="px-4 py-2 border text-black">Payment No.</th>
              <th className="px-4 py-2 border text-black">supplier Name</th>
              <th className="px-4 py-2 border text-black">payment Mode</th>
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
                  {payIn.paymentNo}
                </td>
                <td className="px-4 py-2 border text-black">
                  {payIn.supplierName}
                </td>
                <td className="px-4 py-2 border text-black">
                  {payIn.paymentMode}
                </td>
                <td className=" gap-5 py-2 border text-center item-center text-black">
                  <button
                    onClick={() => openViewModal(payIn)}
                    className="text-blue-500 mr-2 hover:underline focus:outline-none"
                  >
                    <MdRateReview className="text-xl" />
                  </button>
                  <button
                    onClick={() => openEditModal(payIn)}
                    className="text-yellow-500 hover:underline focus:outline-none"
                  >
                    <FiEdit className="text-xl" />
                  </button>
         
                  <button
                    onClick={() => handleDelete(payIn._id)}
                    className="text-red-500 ml-2 hover:underline focus:outline-none"
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
          <h2 className="text-2xl text-center font-bold">Pay In Details</h2>
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
                Payment No.
              </label>
              <input
                type="text"
                value={selectedPayIn.paymentNo}
                readOnly
                className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md font-bold text-black">
                supplier Name
              </label>
              <input
                type="text"
                value={selectedPayIn.supplierName}
                readOnly
                className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md font-bold text-black">
                Payment Mode
              </label>
              <input
                type="text"
                value={selectedPayIn.paymentMode}
                readOnly
                className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
              />
            </div>
          </div>

          {selectedPayIn.paymentMode === "Bank" && (
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
                  <th className="px-4 py-2 border text-black">Invoice No.</th>
                  <th className="px-4 py-2 border text-black">
                    Invoice Amount
                  </th>
                  <th className="px-4 py-2 border text-black">
                    Payment Amount
                  </th>
                  <th className="px-4 py-2 border text-black">
                    Balance Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedPayIn?.rows?.map((row) => (
                  <tr className="text-black" key={row._id}>
                    <td className="px-4 py-2 border">{row.billNo}</td>
                    <td className="px-4 py-2 border">{row.billAmount}</td>
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
                  Payment No.
                </label>
                <input
                  type="text"
                  className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
                  value={paymentNo}
                  onChange={(e) => setpaymentNo(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-md font-bold text-black">
                  Select supplier
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={supplierName}
                  onChange={handlesupplierChange}
                >
                  <option value="">Select supplier</option>
                  {supplier?.map((supplier) => (
                    <option key={supplier._id} value={supplier.name}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-md font-bold text-black">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setpaymentMode(e.target.value)}
                  className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                </select>
              </div>

              {paymentMode === "Bank" && (
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
                    <th className="border border-gray-500 p-1">Invoice NO</th>
                    <th className="border border-gray-500 p-1">
                      Invoice Amount
                    </th>

                    <th className="border border-gray-500 p-1">
                      Payment Amount
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
                          {selctedsupplierInvoiceData?.map((item, idx) => (
                            <option key={idx} value={item.invoiceNo}>
                              {item.invoiceNo ? item.invoiceNo : "NA"}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border border-gray-500 p-1">
                        {row.billAmount || "NA"}
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
