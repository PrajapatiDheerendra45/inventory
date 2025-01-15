import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../../context/Auth";

const SupplierLedger = () => {
  const [userId, setUserId] = useState("");
  const [salesInvoice, setSalesInvoice] = useState([]);
  const [payIns, setPayIns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [auth] = useAuth();

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `/api/v1/purchaseInvoiceRoute/getAllpurchaseinvoice/${userId}`
      );
      const invoices = response.data.invoices;
      setSalesInvoice(invoices);
    } catch (error) {
      console.log("Error fetching sales invoices.");
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageSupplier/${userId}`);
      const customerData = response.data.data;
      setCustomers(customerData);
    } catch (error) {
      console.log("Error fetching customers.");
    }
  };

  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id);
    } else if (auth.user.role === 0) {
      setUserId(auth.user.admin);
    }
  }, [auth]);

  const fetchPayIns = async () => {
    try {
      const response = await axios.get(`/api/v1/payOutRoute/getAllpayOut/${userId}`);
      setPayIns(response.data.payOutList);
      console.log(response, "aksjdfksdj");
    } catch (error) {
      console.error("Error fetching PayOuts:", error);
    }
  };

  useEffect(() => {
    fetchPayIns();
    fetchInvoice();
    if (userId) {
      fetchCustomers();
    }
  }, [userId]);

  const handleCustomerSelect = (e) => {
    const name = e.target.value;
    setSelectedCustomer(name);

    const selectedCustomerData = customers.find(
      (customer) => customer.name === name
    );

    if (selectedCustomerData) {
      setOpeningBalance(selectedCustomerData.openingBalance);
    } else {
      setOpeningBalance(0);
    }
  };

  // Filter sales invoices and pay-ins based on customer and date range
  const filterTransactions = (transactions, isInvoice = true) => {
    return transactions?.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const isWithinDateRange =
        (!startDate || transactionDate >= new Date(startDate)) &&
        (!endDate || transactionDate <= new Date(endDate));

      const customerField = isInvoice
        ? transaction.supplierName
        : transaction.supplierName;
      return selectedCustomer === customerField && isWithinDateRange;
    });
  };

  useEffect(() => {
    if (selectedCustomer) {
      const filteredInvoices = filterTransactions(salesInvoice, true);
      const filteredPayIns = filterTransactions(payIns, false);

      const debitTotal = filteredInvoices.reduce(
        (sum, invoice) => sum + (Number(invoice.netAmount) || 0),
        openingBalance || 0
      );

      const creditTotal = filteredPayIns.reduce(
        (sum, payIn) => sum + (Number(payIn.grandtotal) || 0),
        0
      );

      const totalClosingBalance = creditTotal - debitTotal;

      setTotalDebit(debitTotal + totalClosingBalance);
      setTotalCredit(creditTotal);
      setClosingBalance(totalClosingBalance);
    }
  }, [
    selectedCustomer,
    salesInvoice,
    payIns,
    openingBalance,
    startDate,
    endDate,
  ]);

  const handleReset = () => {
    setSelectedCustomer("");
    setStartDate("");
    setEndDate("");
    setOpeningBalance(0);
    setTotalDebit(0);
    setTotalCredit(0);
    setClosingBalance(0);
  };

  return (
    <div
      className="responsive-container"
      style={{ backgroundColor: "#FFFFFF", color: "black", padding: "20px" }}
    >
      <h2 className="text-center text-3xl">Supplier Ledger</h2>
      <div className="p-1 rounded-lg flex flex-wrap gap-1">
        <div className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
          <label
            htmlFor="startdate"
            className="block text-sm font-medium text-gray-600"
          >
            From
          </label>
          <input
            id="startdate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>
        <div className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
          <label
            htmlFor="enddate"
            className="block text-sm font-medium text-gray-600"
          >
            To
          </label>
          <input
            id="enddate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>
        <div className="mt-5 w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
          <select
            className="block w-full border p-3 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
            onChange={handleCustomerSelect}
            value={selectedCustomer}
          >
            <option value="">Select Supplier</option>
            {customers?.map((customer, index) => (
              <option key={index} value={customer.name}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-6 w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleReset}
          >
            Reset Filters
          </button>
        </div>
      </div>
      {selectedCustomer && ( // Only render the table if a supplier is selected
        <table border="1" style={{ width: "100%", textAlign: "center" }}>
          <thead>
            <tr>
              <th className="p-2 border border-black">Date</th>
              <th className="p-2 border border-black">Particular</th>
              <th className="p-2 border border-black">Voucher Type</th>
              <th className="p-2 border border-black">Voucher No.</th>
              <th className="p-2 border border-black">Debit Amount</th>
              <th className="p-2 border border-black">Credit Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-black"></td>
              <td className="p-2 border border-black">
                <strong style={{ fontSize: "1.2em" }}>Opening Balance</strong>
              </td>
              <td className="p-2 border border-black"></td>
              <td className="p-2 border border-black"></td>
              <td className="p-2 border border-black"></td>
              <td className="p-2 border border-black">
                <strong style={{ fontSize: "1.2em" }}>{openingBalance}</strong>
              </td>
            </tr>
            {filterTransactions(salesInvoice, true)?.map((invoice, index) => (
              <tr key={index}>
                <td className="p-2 border border-black">{invoice.date}</td>
                <td className="p-2 border border-black">By Purchase</td>
                <td className="p-2 border border-black">Purchase</td>
                <td className="p-2 border border-black">{invoice.invoiceNo}</td>
                <td className="p-2 border border-black">{invoice.netAmount}</td>
                <td className="p-2 border border-black"></td>
              </tr>
            ))}
            {filterTransactions(payIns, false)?.map((payIn, index) => (
              <tr key={index}>
                <td className="p-2 border border-black">{payIn.date}</td>
                <td className="p-2 border border-black">
                  By {payIn.paymentMode}
                </td>
                <td className="p-2 border border-black">Payment</td>
                <td className="p-2 border border-black">{payIn.paymentNo}</td>
                <td className="p-2 border border-black"></td>
                <td className="p-2 border border-black">{payIn.grandtotal}</td>
              </tr>
            ))}
            <tr className="p-2 border border-black">
              <td></td>
              <td>
                <strong style={{ fontSize: "1.2em" }}>Closing Balance</strong>
              </td>
              <td></td>
              <td></td>
              <td className="p-2">
                <strong style={{ fontSize: "1.2em" }}>{closingBalance.toFixed(2)}</strong>
              </td>
              <td></td>
            </tr>

            <tr className="p-2 border border-black">
              <td colSpan="4">
                <strong style={{ fontSize: "1.2em" }}>TOTAL</strong>
              </td>
              <td>
                <strong style={{ fontSize: "1.2em" }}>{totalDebit.toFixed(2)}</strong>
              </td>
              <td className="p-2">
                <strong style={{ fontSize: "1.2em" }}>{totalCredit.toFixed(2)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SupplierLedger;
