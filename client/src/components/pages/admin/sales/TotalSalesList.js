import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/Auth";

const TotalSalesList = () => {
  const [salesEstimates, setSalesEstimates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [auth] = useAuth();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id);
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin);
    }
    fetchEstimate();
    fetchCustomers();
  }, [auth, userId]);

  const fetchEstimate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/v1/salesInvoiceRoute/getAllsalesinvoice/${userId}`
      );
      console.log(response,"getAllsalesinvoice")
      setSalesEstimates(response.data.response);
    } catch (error) {
      setError("Error fetching sales estimates.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageCustomer/${userId}`);
      console.log(response,"manageCustomer")
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setSearchTerm("");
  };
  // Filter sales estimates based on search term and date range
  const filteredEstimates = salesEstimates?.filter((estimate) => {
    const invoiceNo = estimate.InvoiceNo
      ? estimate.InvoiceNo.toLowerCase()
      : "";
    const customerName = estimate.customerName
      ? estimate.customerName.toLowerCase()
      : "";
    const searchMatch =
      invoiceNo.includes(searchTerm.toLowerCase()) ||
      customerName.includes(searchTerm.toLowerCase());

    // Date range filtering
    const estimateDate = new Date(estimate.date);
    const isWithinDateRange =
      (!fromDate || estimateDate >= new Date(fromDate)) &&
      (!toDate || estimateDate <= new Date(toDate));

    return searchMatch && isWithinDateRange;
  });

  // Calculate total gross amount for filtered estimates
  const totalGrossAmount = filteredEstimates?.reduce(
    (sum, estimate) => sum + (Number(estimate.grossAmount) || 0),
    0
  );
  const totalNetAmount = filteredEstimates?.reduce(
    (sum, estimate) => sum + (Number(estimate.netAmount) || 0),
    0
  );

  return (
    <div
      style={{ padding: "20px", backgroundColor: "white" }}
      className="responsive-container"
    >
      {/* Heading */}
      <h1 className="text-center text-black text-4xl  mt-3 mb-3">
        Total Sales List
      </h1>

      {/* Date Range and Search Bar */}
      <div className="grid gap-4 grid-cols-1 md:flex md:justify-between items-center mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex flex-col space-y-2 md:space-y-0">
            <label className="font-bold">From</label>
            <input
              type="date"
              className="border p-2 rounded bg-gray-200 w-full md:w-auto"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2 md:space-y-0">
            <label className="font-bold">To</label>
            <input
              type="date"
              className="border p-2 rounded bg-gray-200 w-full md:w-auto"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2 md:space-y-0 mt-3">
          <input
            type="text"
            placeholder="Search by Invoice number, Customer Name"
            className="border p-2 rounded bg-gray-200 w-full md:w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* Reset Button */}
      <div className="flex flex-col space-y-2 text-center md:space-y-0 mt-3 mb-3">
        <button
          onClick={resetFilters}
          className="bg-red-500 w-1/6 text text-center text-white p-2 rounded-md"
        >
          Reset Filters
        </button>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-blue-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-300 bg-gray-100 text-black rounded-lg shadow-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                {[
                  "No.",
                  "Date",
                  "Invoice No.",
                  "Customer Name",
                  "Place of Supply",
                  "Taxable Value",
                  "CGST",
                  "SGST",
                  "IGST",
                  "Net Amount",
                ].map((header) => (
                  <th
                    key={header}
                    className="border border-gray-300 p-2 text-center"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEstimates?.length > 0 ? (
                filteredEstimates?.map((estimate, index) => (
                  <tr
                    key={estimate._id}
                    className="hover:bg-gray-200 transition-all"
                  >
                    <td className="border border-gray-300 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 p-2 text-center whitespace-nowrap">
                      {estimate.date}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate.InvoiceNo}
                    </td>

                    <td className="border border-gray-300 p-2 text-center">
                      {estimate?.customerName}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate?.placeOfSupply}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate?.grossAmount || "0"}
                    </td>

                    <td className="border border-gray-300 p-2 text-center">
                      {estimate.gstType === "CGST/SGST"
                        ? estimate?.GstAmount
                        : "NA"}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate.gstType === "CGST/SGST"
                        ? estimate?.GstAmount
                        : "NA"}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate.gstType === "IGST" ? estimate?.GstAmount : "NA"}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {estimate?.netAmount || "0"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center p-4 border border-gray-300"
                  >
                    No sales invoice found.
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="5"></td>
                <td colSpan="4" className="text-center   ">
                  <div className="text-left font-bold text-2xl ">
                    Total Net Amount:
                  </div>
                </td>
                <td colSpan="1" className="text-center font-bold text-2xl ">
                  {totalNetAmount}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* Display the total gross amount */}
      </div>
    </div>
  );
};

export default TotalSalesList;
