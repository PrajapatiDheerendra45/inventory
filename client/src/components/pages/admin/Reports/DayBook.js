import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../../context/Auth.js'

const DayBook = () => {
  const [auth] = useAuth()
  const [userId, setUserId] = useState('')
  const [salesInvoices, setSalesInvoice] = useState([])
  const [payIns, setPayIns] = useState([])
  const [purchaseInvoices, setPurchaseInvoice] = useState([])
  const [payOuts, setPayOut] = useState([])
  const [dayBookEntries, setDayBookEntries] = useState([])
  const [filteredEntries, setFilteredEntries] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id)
    } else if (auth.user.role === 0) {
      setUserId(auth.user.admin)
    }
  }, [auth])

  useEffect(() => {
    fetchSalesInvoice()
    fetchPayIns()
    fetchPurchaseInvoice()
    fetchPayOut()
  }, [userId])

  const fetchSalesInvoice = async () => {
    try {
      const response = await axios.get(
        `/api/v1/salesInvoiceRoute/getAllsalesinvoice/${userId}`,
      )
      const invoices = response.data.response
      setSalesInvoice(invoices)
    } catch (error) {
      console.log('Error fetching sales invoices.')
    }
  }

  const fetchPayIns = async () => {
    try {
      const response = await axios.get(
        `/api/v1/payInRoute/getAllpayin/${userId}`,
      )
      setPayIns(response.data.payInList)
    } catch (error) {
      console.error('Error fetching PayIns:', error)
    }
  }

  const fetchPurchaseInvoice = async () => {
    try {
      const response = await axios.get(
        `/api/v1/purchaseInvoiceRoute/getAllpurchaseinvoice/${userId}`,
      )
      const invoices = response.data.invoices
      setPurchaseInvoice(invoices)
    } catch (error) {
      console.log('Error fetching purchase invoices.')
    }
  }

  const fetchPayOut = async () => {
    try {
      const response = await axios.get(
        `/api/v1/payOutRoute/getAllpayOut/${userId}`,
      )
      setPayOut(response.data.payOutList)
    } catch (error) {
      console.error('Error fetching PayOuts:', error)
    }
  }

  useEffect(() => {
    const combineData = () => {
      const salesEntries =
        salesInvoices?.map((invoice) => ({
          date: invoice.date,
          particular: invoice.customerName,
          voucherNo: invoice.InvoiceNo,
          voucherType: 'Invoice',
          debit: invoice.netAmount,
          credit: '',
        })) || [] // Fallback to empty array

      const payInEntries =
        payIns?.map((payIn) => ({
          date: payIn.date,
          particular: payIn.selectCustomer,
          voucherNo: payIn.receiptNo,
          voucherType: 'Pay In',
          debit: '',
          credit: payIn.grandtotal,
        })) || [] // Fallback to empty array

      const purchaseEntries =
        purchaseInvoices?.map((invoice) => ({
          date: invoice.date,
          particular: invoice.supplierName,
          voucherNo: invoice.invoiceNo,
          voucherType: 'Purchase',
          debit: invoice.netAmount,
          credit: '',
        })) || [] // Fallback to empty array

      const payOutEntries =
        payOuts?.map((payOut) => ({
          date: payOut.date,
          particular: payOut.supplierName,
          voucherNo: payOut.paymentNo,
          voucherType: 'Pay Out',
          debit: '',
          credit: payOut.grandtotal,
        })) || [] // Fallback to empty array

      setDayBookEntries([
        ...salesEntries,
        ...payInEntries,
        ...purchaseEntries,
        ...payOutEntries,
      ])
    }

    combineData()
  }, [salesInvoices, payIns, purchaseInvoices, payOuts])

  useEffect(() => {
    filterByDate()
  }, [startDate, endDate, dayBookEntries])

  const filterByDate = () => {
    const filtered = dayBookEntries.filter((entry) => {
      const entryDate = new Date(entry.date)
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null

      if (start && end) {
        return entryDate >= start && entryDate <= end
      } else if (start) {
        return entryDate >= start
      } else if (end) {
        return entryDate <= end
      }
      return true // If no dates are selected, return all entries
    })
    setFilteredEntries(filtered)
  }

  return (
    <div className="p-5 bg-blue-900 text-black responsive-container">
      <h1 className="text-3xl text-center font-bold mb-5">Day Book</h1>
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
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200 focus:outline-none"
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
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>
      </div>
      <div className='overflow-x-auto'>
      <table className="table-auto w-full mt-5 border border-black">
        <thead>
          <tr>
            <th className="p-2 border border-black">Date</th>
            <th className="p-2 border border-black">Particular</th>
            <th className="p-2 border border-black">Voucher No.</th>
            <th className="p-2 border border-black">Voucher Type</th>
            <th className="p-2 border border-black">Debit</th>
            <th className="p-2 border border-black">Credit</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries?.map((entry, index) => (
            <tr key={index}>
              <td className="p-2 border border-black">{entry.date}</td>
              <td className="p-2 border border-black">{entry.particular}</td>
              <td className="p-2 border border-black">{entry.voucherNo}</td>
              <td className="p-2 border border-black">{entry.voucherType}</td>
              <td className="p-2 border border-black">{entry.debit}</td>
              <td className="p-2 border border-black">{entry.credit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default DayBook
