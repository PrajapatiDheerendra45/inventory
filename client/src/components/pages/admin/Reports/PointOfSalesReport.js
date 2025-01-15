import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaEye, FaPrint } from 'react-icons/fa' // Import icons from FontAwesome
import InvoiceModal from './InvoiceModel.js' // Import the modal component
import { useAuth } from '../../../context/Auth.js'

function PointOfSalesReport() {
  const [invoice, setInvoice] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [searchInvoice, setSearchInvoice] = useState('')
  const [totalValue, setTotalValue] = useState(0) // State for total value (initial load)
  const [totalCount, setTotalCount] = useState(0) // State for total count (initial load)
  const [selectedInvoice, setSelectedInvoice] = useState(null) // State for the selected invoice

  const [auth] = useAuth()
  const [userId, setUserId] = useState('')

  const fetchEstimate = async () => {
    try {
      const response = await axios.get(
        `/api/v1/pointOfSaleRoute/getAllpof/${userId}`,
      )
      console.log(response, 'response....')

      const allInvoices = response.data.posList
      setInvoice(allInvoices)
      setFilteredInvoices(allInvoices)

      // Calculate total value and total count for the initial data load
      const initialTotalValue = allInvoices.reduce(
        (sum, inv) => sum + parseFloat(inv.netAmount),
        0,
      )
      setTotalValue(initialTotalValue)
      setTotalCount(allInvoices.length)
    } catch (error) {
      console.log('Error fetching point of sales')
    }
  }

  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id)
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin)
    }
    fetchEstimate()
  }, [auth, userId])

  // Function to filter invoices based on date range and invoice number
  const filterInvoices = () => {
    let filteredData = invoice

    // Filter by date range if both startDate and endDate are provided
    if (startDate && endDate) {
      filteredData = filteredData?.filter((inv) => {
        const invoiceDate = new Date(inv.date)
        return (
          invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate)
        )
      })
    }

    // Filter by invoice number if searchInvoice is provided
    if (searchInvoice) {
      filteredData = filteredData?.filter((inv) =>
        inv.invoicNo.includes(searchInvoice),
      )
    }

    setFilteredInvoices(filteredData)

    // Calculate total value and total count based on filtered data
    const totalVal = filteredData?.reduce(
      (sum, inv) => sum + parseFloat(inv.netAmount),
      0,
    )
    setTotalValue(totalVal)
    setTotalCount(filteredData.length)
  }

  // Use effect to trigger filtering whenever the startDate, endDate, or searchInvoice changes
  useEffect(() => {
    filterInvoices()
  }, [startDate, endDate, searchInvoice])

  const print = () => {
    window.print()
  }

  const resetFilters = () => {
    setStartDate('')
    setEndDate('')
    setSearchInvoice('')

    setFilteredInvoices(invoice)
    setTotalValue(
      invoice.reduce((sum, inv) => sum + parseFloat(inv.netAmount), 0),
    )
    setTotalCount(invoice.length)
  }

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
            .cucolor {
              color: red;
            }
            .hide-on-print button {
              display: none !important;
            }
            .print-container {
              display: block;
              page-break-before: always;
            }
            html, body {
              width: 270mm;
            }
      `}
      </style>
      <h2 className="text-3xl font-semibold mb-4 text-center">
        Point of Sales Report
      </h2>
      <div className="p-1 rounded-lg flex flex-wrap gap-1">
        <div className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
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
        <div className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
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
        <div className="mt-5 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <input
            type="text"
            placeholder="Search Invoice Number"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200 focus:outline-none"
            value={searchInvoice}
            onChange={(e) => setSearchInvoice(e.target.value)}
          />
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
              <th>#</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Invoice No.</th>
              <th className="px-4 py-2">Customer Detail</th>
              <th className="px-4 py-2">Payment Type</th>
              <th className="px-4 py-2">Total Value</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices?.length > 0 ? (
              filteredInvoices?.map((inv, index) => (
                <tr key={inv._id} className="text-center">
                  <td>{index + 1}</td>
                  <td className="border px-4 py-2 text-nowrap">{inv.date}</td>
                  <td className="border px-4 py-2">{inv.invoicNo}</td>
                  <td className="border px-4 py-2">{inv.customerDetail}</td>
                  <td className="border px-4 py-2">{inv.paymentType}</td>
                  <td className="border px-4 py-2">{inv.netAmount}</td>
                  <td className="px-4 py-2 flex gap-5 hide-on-print">
                    <button
                      className="text-blue-500 flex items-center"
                      onClick={() => setSelectedInvoice(inv)}
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

      {selectedInvoice && ( // Render the modal if there's a selected invoice
        <InvoiceModal
          invoice1={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  )
}

export default PointOfSalesReport