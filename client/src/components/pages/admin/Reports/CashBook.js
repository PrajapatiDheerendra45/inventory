import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../../context/Auth.js'

const CashBook = () => {
  const [userId, setUserId] = useState('')
  const [salesInvoice, setSalesInvoice] = useState([])
  const [payIns, setPayIns] = useState([])
  const [cashWithdrawals, setCashWithdrawals] = useState([])
  const [cashDeposite, setCashDeposite] = useState([])
  const [PayOut, setPayOut] = useState([])
  const [openingBalance, setOpeningBalance] = useState(0)
  const [totalDebit, setTotalDebit] = useState(0)
  const [totalCredit, setTotalCredit] = useState(0)
  const [closingBalance, setClosingBalance] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [auth] = useAuth()

  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id)
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin)
    }
  }, [auth, userId])

  const fetchCash = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageCash/${userId}`)
      setOpeningBalance(response.data.data[0].openingBalance)
    } catch (error) {
      console.error('Error fetching cash data', error)
    }
  }

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `/api/v1/salesInvoiceRoute/getAllsalesinvoice/${userId}`,
      )
      const invoices = response.data.response || []
      setSalesInvoice(invoices)
    } catch (error) {
      console.log('Error fetching sales invoices.')
    }
  }

  const fetchPayIns = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `/api/v1/payInRoute/getAllpayin/${userId}`,
        )
        setPayIns(response.data.payInList || [])
      } catch (error) {
        console.error('Error fetching PayIns:', error)
      }
    }
  }

  const fetchCashWithdrawFromBank = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `/api/v1/auth/getCashWithdrawfromBank/${userId}`,
        )
        setCashWithdrawals(response.data.data || []) // Update to set withdrawals
      } catch (error) {
        console.error('Error fetching cash withdrawals:', error)
      }
    }
  }

  const fetchCashDepositeIntoBank = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `/api/v1/auth/getCashDepositeIntoBank/${userId}`,
        )
        setCashDeposite(response.data.data) // Update to set withdrawals
      } catch (error) {
        console.error('Error fetching cash withdrawals:', error)
      }
    }
  }

  const fetchPayOut = async () => {
    try {
      const response = await axios.get(
        `/api/v1/PayOutRoute/getAllpayout/${userId}`,
      )
      setPayOut(response.data.payOutList)
    } catch (error) {
      console.error('Error fetching PayIns:', error)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchPayIns()
      fetchInvoice()
      fetchCash()
      fetchCashWithdrawFromBank()
      fetchCashDepositeIntoBank()
      fetchPayOut()
    }
  }, [userId])

  const filterTransactions = (transactions, isInvoice) => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date)
      const fromDate = startDate ? new Date(startDate) : null
      const toDate = endDate ? new Date(endDate) : null

      return (
        (!fromDate || transactionDate >= fromDate) &&
        (!toDate || transactionDate <= toDate)
      )
    })
  }

  useEffect(() => {
    const filteredSales = filterTransactions(
      salesInvoice.filter((invoice) => invoice.selctedcash === 'cash'),
      true,
    )

    const filteredPayIns = filterTransactions(
      payIns.filter((payIn) => payIn.receiptMode === 'Cash'),
      false,
    )

    const filteredWithdrawals = filterTransactions(cashWithdrawals, false)
    const filteredDeposits = filterTransactions(cashDeposite, false)
    const filteredPayouts = filterTransactions(
      PayOut.filter((PayOut) => PayOut.paymentMode === 'Cash'),
      false,
    )

    // Total Debit calculation: filtered sales, payIns, withdrawals, and opening balance
    const totalDebit =
      Number(openingBalance) +
      filteredSales.reduce(
        (acc, invoice) => acc + Number(invoice.netAmount),
        0,
      ) +
      filteredPayIns.reduce((acc, payIn) => acc + Number(payIn.grandtotal), 0) +
      filteredWithdrawals.reduce(
        (acc, withdrawal) => acc + Number(withdrawal.amount),
        0,
      )

    // Total Credit calculation: filtered deposits and payouts
    const totalCredit =
      filteredDeposits.reduce(
        (acc, deposit) => acc + Number(deposit.amount),
        0,
      ) +
      filteredPayouts.reduce(
        (acc, payout) => acc + Number(payout.grandtotal),
        0,
      )

    // Closing balance calculation: Total Debit - Total Credit
    const closingBalance = totalDebit - totalCredit

    setTotalDebit(totalDebit)
    setTotalCredit(totalCredit)
    setClosingBalance(closingBalance)
  }, [
    salesInvoice,
    payIns,
    cashWithdrawals,
    cashDeposite,
    PayOut,
    startDate,
    endDate,
    openingBalance,
  ])

  const handleReset = () => {
    setStartDate('')
    setEndDate('')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  return (
    <div
      className="responsive-container"
      style={{ backgroundColor: '#FFFFFF', color: 'black', padding: '20px' }}
    >
      <h2 className="text-center text-3xl">Cash Book</h2>
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

        <div className=" mb-4 mt-6 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleReset}
          >
            Reset Filters
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table border="1" style={{ width: '100%', textAlign: 'center' }}>
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
              <td className="p-2">
                <strong style={{ fontSize: '1em' }}>Opening Balance</strong>
              </td>
              <td className="p-2 border border-black"></td>
              <td className="p-2 border border-black"></td>
              <td>
                <strong style={{ fontSize: '1em' }}>{openingBalance}</strong>
              </td>
              <td className="p-2 border border-black"></td>
            </tr>

            {filterTransactions(salesInvoice, true)?.map((invoice, index) => {
              return invoice.selctedcash &&
                invoice.selctedcash.toLowerCase() === 'cash' ? (
                <tr key={index}>
                  <td className="p-2 border border-black">{invoice.date}</td>
                  <td className="p-2 border border-black">To Sales</td>
                  <td className="p-2 border border-black">Sales</td>
                  <td className="p-2 border border-black">
                    {invoice.InvoiceNo}
                  </td>
                  <td className="p-2 border border-black">
                    {invoice.netAmount}
                  </td>
                  <td className="p-2 border border-black"></td>
                </tr>
              ) : null
            })}

            {filterTransactions(payIns, false)?.map((payIn, index) => {
              return payIn.receiptMode &&
                payIn.receiptMode.trim().toLowerCase() === 'cash' ? (
                <tr key={index}>
                  <td className="p-2 border border-black">{payIn.date}</td>
                  <td className="p-2 border border-black">
                    {payIn.selectCustomer}
                  </td>
                  <td className="p-2 border border-black">PayIn</td>
                  <td className="p-2 border border-black">{payIn.receiptNo}</td>
                  <td className="p-2 border border-black">
                    {payIn.grandtotal}
                  </td>
                  <td className="p-2 border border-black"></td>
                </tr>
              ) : null
            })}

            {/* Render cash withdrawals */}
            {filterTransactions(cashWithdrawals, false)?.map(
              (withdrawal, index) => {
                return (
                  <tr key={index}>
                    <td className="p-2 border border-black">
                      {formatDate(withdrawal.date)}
                    </td>{' '}
                    {/* Format date here */}
                    <td className="p-2 border border-black">By Bank</td>
                    <td className="p-2 border border-black">Contra</td>
                    <td className="p-2 border border-black">
                      {withdrawal.contraNo || 'N/A'}
                    </td>
                    <td className="p-2 border border-black">
                      {withdrawal.amount}
                    </td>
                    <td className="p-2 border border-black"></td>
                  </tr>
                )
              },
            )}

            {filterTransactions(cashDeposite, false)?.map((deposit, index) => {
              return (
                <tr key={index}>
                  <td className="p-2 border border-black">
                    {formatDate(deposit.date)}
                  </td>{' '}
                  {/* Format date here */}
                  <td className="p-2 border border-black">By Cash</td>
                  <td className="p-2 border border-black">Contra</td>
                  <td className="p-2 border border-black">
                    {deposit.contraNo || 'N/A'}
                  </td>
                  <td className="p-2 border border-black"></td>{' '}
                  {/* Debit will be empty */}
                  <td className="p-2 border border-black">
                    {deposit.amount}
                  </td>{' '}
                  {/* Show deposit amount in Credit column */}
                </tr>
              )
            })}

            {filterTransactions(PayOut, false)?.map((payout, index) => {
              return payout.paymentMode &&
                payout.paymentMode.trim().toLowerCase() === 'cash' ? (
                <tr key={index}>
                  <td className="p-2 border border-black">
                    {formatDate(payout.date)}
                  </td>{' '}
                  {/* Format date */}
                  <td className="p-2 border border-black">
                    {payout.supplierName}
                  </td>{' '}
                  {/* Supplier name */}
                  <td className="p-2 border border-black">PayOut</td>{' '}
                  {/* Voucher Type */}
                  <td className="p-2 border border-black">
                    {payout.paymentNo || 'N/A'}
                  </td>{' '}
                  {/* Voucher No */}
                  <td className="p-2 border border-black"></td>{' '}
                  {/* Debit will be empty */}
                  <td className="p-2 border border-black">
                    {payout.grandtotal}
                  </td>{' '}
                  {/* Credit side */}
                </tr>
              ) : null
            })}

            <tr className="border border-black">
              <td></td>
              <td>
                <strong style={{ fontSize: '1em' }}>Closing Balance</strong>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td className="p-2 ">
                <strong style={{ fontSize: '1em' }}>
                  {closingBalance.toFixed(2)}
                </strong>
              </td>
            </tr>
            <tr className="border border-black">
              <td colSpan="4">
                <strong style={{ fontSize: '1.2em' }}>TOTAL</strong>
              </td>
              <td>
                <strong style={{ fontSize: '1.2em' }}>{totalDebit}</strong>
              </td>
              <td>
                <strong style={{ fontSize: '1.2em' }}>{totalCredit}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CashBook
