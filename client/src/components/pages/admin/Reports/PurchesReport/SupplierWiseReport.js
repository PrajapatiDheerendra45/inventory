import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'

import axios from 'axios'
import { FaEye, FaPrint } from 'react-icons/fa'
import ViewPurchaseInvoices from '../../modals//ViewPurchaseInvoices'
import { useAuth } from '../../../../context/Auth'

const SupplierWiseReports = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [invoice, setInvoice] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [totalValue, setTotalValue] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [customerNames, setCustomerNames] = useState([])
  const [customers, setCustomers] = useState([])
  const [auth] = useAuth()
  const [userId, setUserId] = useState('')

  const fetchEstimate = async () => {
    try {
      const response = await axios.get(
        `/api/v1/purchaseInvoiceRoute/getAllpurchaseinvoice/${userId}`,
      )
      const allInvoices = response.data.invoices
      setInvoice(allInvoices)
      setFilteredInvoices(allInvoices)

      // Extract unique customer names
      const uniqueCustomers = [
        ...new Set(allInvoices.map((inv) => inv.supplierName)),
      ]
      setCustomerNames(uniqueCustomers) // Set the customer names for dropdown

      // Calculate total value and total count for the initial data load
      const initialTotalValue = allInvoices?.reduce(
        (sum, inv) => sum + parseFloat(inv.netAmount),
        0,
      )
      setTotalValue(initialTotalValue)
      setTotalCount(allInvoices.length)
    } catch (error) {
      console.log('Error fetching sales estimates.')
    }
  }

  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id)
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin)
    }
    fetchCustomers()
    fetchEstimate()
  }, [auth, userId])

  const handleView = (inv) => {
    setInvoice(inv) // Set the specific invoice being clicked
    setViewModalOpen(true) // Open the modal
  }

  // Function to filter invoices based on date range and selected supplier
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

    // Filter by supplier name if selectedSupplier is provided
    if (selectedSupplier) {
      filteredData = filteredData?.filter(
        (inv) => inv.supplierName === selectedSupplier,
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

  // Use effect to trigger filtering whenever the startDate, endDate, or selectedSupplier changes
  useEffect(() => {
    filterInvoices()
  }, [startDate, endDate, selectedSupplier])

  const print = () => {
    window.print()
  }

  const closeModal = () => {
    setViewModalOpen(false)
  }

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageSupplier/${userId}`)
      setCustomers(response.data.data)
    } catch (error) {
      console.error('Error fetching customers', error)
    }
  }

  const resetFilters = () => {
    setStartDate('')
    setEndDate('')
    setSelectedSupplier('')

    setFilteredInvoices(invoice)
    setTotalValue(
      invoice.reduce((sum, inv) => sum + parseFloat(inv.netAmount), 0),
    )
    setTotalCount(invoice.length)
  }

  return (
    <div className="p-5 rounded-lg responsive-container">
      <h2 className="text-3xl font-semibold mb-4 text-center">
        Supplier Wise Purchase Report
      </h2>
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
        <div className="mt-5 mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200 focus:outline-none"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
          >
            <option value="">Select Supplier</option>
            {customerNames.map((customer, index) => (
              <option key={index} value={customer}>
                {customer}
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
      <table className="min-w-full table-auto">
        <thead className="bg-blue-200">
          <tr>
            <th>#</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Invoice No.</th>
            <th className="px-4 py-2">Supplier Name</th>
            <th className="px-4 py-2">Place of Supply</th>
            <th className="px-4 py-2">Net Amount</th>
            <th className="px-4 py-2 hide-on-print">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredInvoices?.length > 0 ? (
            filteredInvoices?.map((inv, index) => (
              <tr key={inv._id} className="text-center">
                <td>{index + 1}</td>
                <td className="border px-4 py-2">{inv.date}</td>
                <td className="border px-4 py-2">{inv.invoiceNo}</td>
                <td className="border px-4 py-2">{inv.supplierName}</td>
                <td className="border px-4 py-2">{inv.placeOfSupply}</td>

                <td className="border px-4 py-2">{inv.netAmount}</td>
                <td className="border px-4 py-2 flex gap-5 hide-on-print ">
                  <button
                    className="text-blue-500 flex items-center "
                    onClick={() => handleView(inv)}
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={print}
                    className="text-blue-500 flex items-center "
                  >
                    <FaPrint />
                  </button>{' '}
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
            {' '}
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
      <Modal
        isOpen={viewModalOpen}
        onRequestClose={closeModal}
        contentLabel="View Estimate Modal"
        style={{
          content: {
            width: '90%',
            height: '100%',
            maxWidth: '1400px',
            margin: 'auto',
            padding: '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '5px',
          },
        }}
      >
        <ViewPurchaseInvoices
          isOpen={viewModalOpen}
          closeModal={closeModal}
          estimate={invoice}
        />
      </Modal>
    </div>
  )
}

export default SupplierWiseReports
