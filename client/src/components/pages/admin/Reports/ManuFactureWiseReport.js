import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useAuth } from "../../../context/Auth";

import { FaEye, FaPrint } from "react-icons/fa"; // Import icons from FontAwesome
import ViewSalesInvoiceModal from "../modals/ViewSalesInvoiceModal";

function ManuFactureWiseReport() {
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [invoice, setInvoice] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchInvoice, setSearchInvoice] = useState("");
  const [totalValue, setTotalValue] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [manufacturer, setManufacturer] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [customers, setCustomers] = useState([]);
  const [auth] = useAuth();
  const [userId, setUserId] = useState("");

  const fetchManufacturer = async () => {
    try {
      const response = await axios.get("/api/v1/auth/ManageManufacturer");
      setManufacturer(response.data.data);
      console.log(response, "res");
    } catch (error) {
      console.error("Error fetching Manufacturer data", error);
    }
  };
  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id);
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin);
    }
    fetchCustomers();
    fetchEstimate();
    fetchManufacturer();
  }, [auth, userId]);

  const fetchEstimate = async () => {
    try {
      const response = await axios.get(
        "/api/v1/salesInvoiceRoute/getAllsalesinvoice"
      );
      const allInvoices = response.data.response;
      setInvoice(allInvoices);
      setFilteredInvoices(allInvoices);

      const initialTotalValue = allInvoices.reduce(
        (sum, inv) => sum + parseFloat(inv.netAmount),
        0
      );
      setTotalValue(initialTotalValue);
      setTotalCount(allInvoices.length);
    } catch (error) {
      console.log("Error fetching sales estimates.");
    }
  };

  const handleView = (inv) => {
    setInvoice(inv); // Set the specific invoice being clicked
    setViewModalOpen(true); // Open the modal
  };

  const filterInvoices = () => {
    let filteredData = invoice;

    if (startDate && endDate) {
      filteredData = filteredData.filter((inv) => {
        const invoiceDate = new Date(inv.date);
        return (
          invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate)
        );
      });
    }

    if (searchInvoice) {
      filteredData = filteredData.filter((inv) =>
        inv.InvoiceNo.includes(searchInvoice)
      );
    }

    if (selectedManufacturer) {
      filteredData = filteredData.filter(
        (inv) => inv.customerName === selectedManufacturer
      );
    }

    setFilteredInvoices(filteredData);

    const totalVal = filteredData.reduce(
      (sum, inv) => sum + parseFloat(inv.netAmount),
      0
    );
    setTotalValue(totalVal);
    setTotalCount(filteredData.length);
  };

  useEffect(() => {
    filterInvoices();
  }, [startDate, endDate, searchInvoice, selectedManufacturer]);

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchInvoice("");
    setSelectedManufacturer("");
    setFilteredInvoices(invoice);
    setTotalValue(
      invoice.reduce((sum, inv) => sum + parseFloat(inv.netAmount), 0)
    );
    setTotalCount(invoice.length);
  };

  const print = () => {
    window.print();
  };

  const closeModal = () => {
    setViewModalOpen(false);
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageCustomer/${userId}`);
      console.log(response, "ldsf");
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "Unknown Customer";
  };

  return (
    <div className="p-5 rounded-lg responsive-container">
      <style>
        {`
           @media print {
            @page {
              size: A4;
              margin: 0;
              width: 100%;
            }
            body * {
              visibility: hidden;
            }
            .responsive-container, .responsive-container * {
              visibility: visible;
            }
            .responsive-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .hide-on-print {
              display: none !important;
            }
            .print-container {
              display: block;
              page-break-before: always;
            }
            html, body {
              width: 270mm;
            }
            .flex {
              display: flex;
              flex-wrap: wrap;
              gap: 1rem;
            }
            .flex-item {
              flex: 1 1 24%; 
              min-width: 200px; 
            }
      `}
      </style>
      <h2 className="text-3xl font-semibold mb-4 text-center">
        Manufacturer Wise Sales Report
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 lg:grid-cols-4 gap-3 mb-4">
        <div className="flex-item">
          <label
            htmlFor="startdate"
            className="block text-sm font-medium text-gray-600"
          >
            From
          </label>
          <input
            id="startdate"
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200 focus:outline-none"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex-item">
          <label
            htmlFor="enddate"
            className="block text-sm font-medium text-gray-600"
          >
            To
          </label>
          <input
            id="enddate"
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200 focus:outline-none"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex-item sm:mt-5 lg:mt-5 md:mt-5">
          <input
            type="text"
            placeholder="Search Invoice Number"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200 focus:outline-none"
            value={searchInvoice}
            onChange={(e) => setSearchInvoice(e.target.value)}
          />
        </div>
        <div className="flex-item  sm:mt-5 lg:mt-5 md:mt-5">
          <select
            className="block w-full border p-3 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
            value={selectedManufacturer}
            onChange={(e) => setSelectedManufacturer(e.target.value)}
          >
            <option value="">Select Manufacturer</option>
            {manufacturer?.map((manufacturer) => (
              <option key={manufacturer._id} value={manufacturer.name}>
                {manufacturer.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={resetFilters}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Reset Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-200">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Invoice No.</th>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Place of Supply</th>
              <th className="px-4 py-2">Total Value</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices?.map((inv, index) => (
                <tr key={inv._id} className="text-center">
                  <td>{index + 1}</td>
                  <td className="border px-4 py-2 text-nowrap">{inv.date}</td>
                  <td className="border px-4 py-2">{inv.InvoiceNo}</td>
                  <td className="border px-4 py-2">{inv.customerName}</td>
                  <td className="border px-4 py-2">{inv.placeOfSupply}</td>
                  <td className="border px-4 py-2">{inv.netAmount}</td>
                  <td className="px-4 py-2 flex gap-5 hide-on-print">
                    <button
                      className="text-blue-500 flex items-center"
                      onClick={() => handleView(inv)}
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={print}
                      className="text-blue-500 flex items-center"
                    >
                      <FaPrint />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
            <tr className="border px-4 py-2">
              <td></td>
              <th colSpan="4" className="border px-4 py-2">
                Total Value:
              </th>
              <td colSpan="2" className="border px-4 py-2 text-bold font-bold">
                ₹{totalValue.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={viewModalOpen}
        onRequestClose={closeModal}
        contentLabel="View Estimate Modal"
        style={{
          content: {
            width: "90%",
            height: "100%",
            maxWidth: "1400px",
            margin: "auto",
            padding: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
          },
        }}
      >
        <ViewSalesInvoiceModal
          isOpen={viewModalOpen}
          closeModal={closeModal}
          estimate={invoice}
          getCustomerName={getCustomerName}
        />
      </Modal>
    </div>
  );
}

export default ManuFactureWiseReport;
