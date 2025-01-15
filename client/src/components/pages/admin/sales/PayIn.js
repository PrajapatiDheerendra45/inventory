import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // Import toastify CSS
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'
import { useAuth } from '../../../context/Auth.js'
const PayIn = () => {
  const [customer, setCustomer] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [date, setDate] = useState('')
  const [receiptNo, setReceiptNo] = useState('')
  const [Narration, setNarration] = useState('') // Ensure narration is defined
  const [receiptMode, setReceiptMode] = useState('Cash')
  const [selectBank, setSelectBank] = useState('')
  const [selctedCustomerInvoiceData, setSelctedCustomerInvoiceData] = useState(
    [],
  )

  const [selectedValue, setSelectedValue] = useState("");

  const [isAdvancedReceiptSelected, setIsAdvancedReceiptSelected] = useState(false);
  const handleAdvancedReceiptChange = (event) => {
    setIsAdvancedReceiptSelected(event.target.checked);
  };
  const [Banks, setBanks] = useState([])

  const [auth] = useAuth()
  const [userId, setUserId] = useState('')
  const [rows, setRows] = useState([
    {
      id: 1,
      billNo: '',
      billAmount: '',
      paidAmount: '',
      recievedAmount: '',
      balanceAmount: '',
    },
  ])

  // Add new states for method and transactionCheckNo
  const [method, setMethod] = useState('') // Added state for method
  const [transactionCheckNo, setTransactionCheckNo] = useState('') // Added state for transaction check number

  useEffect(() => {
    if (auth?.user) {
      if (auth.user.role === 1) {
        setUserId(auth.user._id)
      } else if (auth.user.role === 0) {
        setUserId(auth.user.admin)
      }
    }
    fetchCustomer()
    fetchBanks()
  }, [auth, userId])

  const fetchBanks = async () => {
    try {
      // Assuming the API returns the bank data along with the opening balance
      const response = await axios.get(`/api/v1/auth/manageBank/${userId}`)
      setBanks(response.data.data) // Response should include opening balance for each bank
    } catch (error) {
      console.error('Error fetching Bank data', error)
    }
  }

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageCustomer/${userId}`)
      setCustomer(response.data.data)
    } catch (error) {
      console.error('Error fetching customer:', error)
    }
  }

  const salesinvoicesCustomerByName = async (selectedCustomer) => {
    try {
      const response = await axios.get(
        `/api/v1/salesInvoiceRoute/salesinvoicesByName/${selectedCustomer}`,
      )
      setSelctedCustomerInvoiceData(response.data.response)
    } catch (error) {
      console.error('Error fetching customer invoices:', error)
    }
  }

  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value)
    salesinvoicesCustomerByName(e.target.value)
  }

  const handleRowChange = (index, key, value) => {
    const newRows = [...rows];
    if (key === 'billNo') {
      const selectedInvoice = selctedCustomerInvoiceData.find(
        (item) => item.InvoiceNo === value
      );
      if (selectedInvoice) {
        const paymentData = selectedInvoice.cash ? selectedInvoice.cash : selectedInvoice.bank;
        newRows[index] = {
          ...newRows[index],
          billNo: selectedInvoice.InvoiceNo,
          billAmount: selectedInvoice.netAmount,
          paidAmount: paymentData ? paymentData.Balance : 0,
          balanceAmount: calculateBalance(paymentData ? paymentData.Balance : 0, newRows[index].recievedAmount, isAdvancedReceiptSelected)
        };
      }
    } else {
      newRows[index][key] = value;
      // Calculate balance when receivedAmount is updated
      if (key === 'recievedAmount') {
        newRows[index].balanceAmount = calculateBalance(newRows[index].paidAmount, value, isAdvancedReceiptSelected);
      }
    }
    setRows(newRows);
  };

// const generateReceiptNumber = () => {
//   // Fetch the last receipt number from localStorage or start at 1
//   let lastReceiptNo = parseInt(localStorage.getItem("lastReceiptNo") || "0", 10);
//   const newReceiptNo = lastReceiptNo + 1;

//   // Save the updated receipt number in localStorage
//   localStorage.setItem("lastReceiptNo", newReceiptNo);

//   // Format the receipt number with leading zeros (e.g., 001, 002)
//   return `${String(newReceiptNo).padStart(3, "0")}`;
// };

// // Generate receipt number on component mount
// useEffect(() => {
//   const generatedReceiptNo = generateReceiptNumber();
//   setReceiptNo(generatedReceiptNo);
// }, []);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length ? Math.max(...rows?.map((row) => row.id)) + 1 : 1,
        billNo: '',
        billAmount: '',
        paidAmount: '',
        recievedAmount: '',
        balanceAmount: '',
      },
    ])
  }

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  let grandtotal = 0;
  let alltotal = 0;

  // Function to calculate the balance
  const calculateBalance = (paidAmount, receivedAmount, isAdvancedReceiptSelected) => {
    const credit = parseFloat(paidAmount) || 0;
    const received = parseFloat(receivedAmount) || 0;
    // If advanced receipt is selected, show only received amount in grandtotal
    if (isAdvancedReceiptSelected) {
      return NaN;
    } else {
      grandtotal += credit - received;
      return (credit - received).toFixed(2);
    }
  }

  const GrandTotal = () => {
    let total = 0;

    rows.forEach((row) => {
      const paidAmount = parseFloat(row.paidAmount) || 0;
      const receivedAmount = parseFloat(row.recievedAmount) || 0;

      if (isAdvancedReceiptSelected) {
        total += receivedAmount;
      } else {
        total += paidAmount - receivedAmount;
      }
    });

    return total.toFixed(2);
  };






  // Function to calculate the total received amount
  const calculateTotalReceived = () => {
    return rows
      .reduce((total, row) => {
        return total + parseFloat(row.recievedAmount || 0);
      }, 0)
      .toFixed(2);
  }



  const handleSave = async () => {
    const totalAmount = calculateTotalReceived() // This needs to be defined correctly
    const grandTotal = GrandTotal()
    grandtotal = grandTotal // Ensure grandtotal is set correctly

    const dataToSubmit = {
      userId: userId,
      date,
      receiptNo,
      selectCustomer: selectedCustomer,
      receiptMode,
      selectBank: selectBank.name, // Sending bank name instead of ID
      method,
      transactionCheckNo,
      rows: rows?.map((row) => ({
        billNo: row.billNo,
        billAmount: row.billAmount,
        paidAmount: row.paidAmount, // Ensure this is defined and sent
        recievedAmount: row.recievedAmount,
        balanceAmount: row.balanceAmount,
      })),
      grandtotal, // Ensure grandtotal is set correctly
      Narration,
    }

    try {
      const response= await axios.post('/api/v1/payInRoute/createsalespayin', dataToSubmit)
      toast.success('Data saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
      })
      if (response.data.success) {
        toast.success('Data saved successfully!', {
          position: 'top-right',
          autoClose: 3000,
        })};
      
      // Reset form
      setDate('')
      setReceiptNo('')
      setSelectedCustomer('')
      setReceiptMode('Cash')
      setMethod('')
      setTransactionCheckNo('')
      setRows([
        {
          id: 1,
          billNo: '',
          billAmount: '',
          paidAmount: '',
          recievedAmount: '',
          balanceAmount: '',
        },
      ])
      setNarration('')
    } catch (error) {
      toast.error('Error saving data. Please try again!', {
        position: 'top-right',
        autoClose: 3000,
      })
      console.error('Error saving data:', error)
    }
  }
  return (
    <div
      style={{ backgroundColor: '#FFFFFF' }}
      className="responsive-container bg-pink-200 p-4 rounded-md w-full mx-auto"
    >
      <h1 className="text-center text-3xl  text-black mb-5 cucolor">Pay In</h1>
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
          <label className="text-md font-bold text-black">Receipt No.</label>
          <input
            type="text"
            className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
            value={receiptNo}
            onChange={(e) => setReceiptNo(e.target.value)}
          />
        </div>
        <div>
          <label className="font-bold">Customer Name</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedValue} // This ensures the selected value is shown in the dropdown
            onChange={(e) => {
              const selectedValue = e.target.value;
              setSelectedValue(selectedValue); // Update the state to reflect the selected value

              if (selectedValue === "add-new-customer") {
                window.location.href = "/admin/payincreatecustomer";
              } else {
                handleCustomerChange(e); // Handle customer change
              }
            }}
          >
            <option value="" disabled selected>Select Customer</option> {/* Default selection */}

            {/* Customer Options */}
            <option value="add-new-customer" className="text-blue-500">
              + Add New Customer
            </option>
            <optgroup label="Customers">

              {customer?.map((customer) => (
                <option key={customer.name} value={customer.name}>
                  {customer.name}
                </option>
              ))}

            </optgroup>
          </select>
        </div>


        <div className="flex flex-col">
          <label className="text-md font-bold text-black">Receipt Mode</label>
          <select
            value={receiptMode}
            onChange={(e) => setReceiptMode(e.target.value)}
            className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
          >
            <option value="Cash">Cash</option>
            <option value="Bank">Bank</option>
          </select>
        </div>


        <div className="flex items-center space-x-2">

          <label className="text-md font-bold text-black">
            Advanced Receipt
          </label>
          <input
            type="checkbox"
            checked={isAdvancedReceiptSelected}
            onChange={handleAdvancedReceiptChange}
          />

        </div>


        {receiptMode === 'Bank' && (
          <>
            <div className="flex flex-col">
              <label className="text-md font-bold text-black">
                Select Bank
              </label>
              <select
                id="bankSelect"
                value={selectBank?.name || ''}
                onChange={(e) => {
                  const selected = Banks.find(
                    (bank) => bank.name === e.target.value,
                  )
                  setSelectBank(selected)
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200 focus:outline-none"
              >
                <option value="">-- Select Bank --</option>
                {Banks.map((bank) => (
                  <option key={bank._id} value={bank.name}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-md font-bold text-black">Method</label>
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
              <th className="border border-gray-500 p-1">Bill No</th>
              <th className="border border-gray-500 p-1">Bill Amount</th>
              <th className="border border-gray-500 p-1">Balance Amount</th>
              <th className="border border-gray-500 p-1">Received Amount</th>
              <th className="border border-gray-500 p-1">Net Balance Amount</th>
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
                    disabled={isAdvancedReceiptSelected}

                    onChange={(e) =>
                      handleRowChange(index, 'billNo', e.target.value)
                    }
                    className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option className="text-black">Select</option>
                    {selctedCustomerInvoiceData?.map((item, idx) => (
                      <option key={idx} value={item.InvoiceNo}>
                        {item.InvoiceNo ? item.InvoiceNo : 'NA'}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-500 p-1" disabled={isAdvancedReceiptSelected}
                >
                  {row.billAmount || 'NA'}
                </td>
                <td className="border border-gray-500 p-1" disabled={isAdvancedReceiptSelected}
                >
                  {typeof row.paidAmount === 'number' ? row.paidAmount.toFixed(2) : 'NA'}
                </td>

                <td className="border border-gray-500 p-1">
                  <input
                    type="text"
                    value={row.recievedAmount || ''}
                    onChange={(e) =>
                      handleRowChange(index, 'recievedAmount', e.target.value)
                    }
                    className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="border border-gray-500 p-1" disabled={isAdvancedReceiptSelected}
                >
                  {calculateBalance(
                    row.paidAmount,
                    row.recievedAmount,
                    isAdvancedReceiptSelected

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
                    onClick={() => removeRow(row.id)}
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
        <label className="text-2xl font-bold text-black mr-2">Total</label>
        <input
          type="text"
          value={GrandTotal()} // Dynamically calculate grand total
          readOnly
          className="p-1 border border-gray-500 w-1/2 rounded-md bg-gray-200"
        />
      </div>
      <div className="flex flex-row justify-left gap-5 mt-10">
        <label className="text-2xl font-bold text-black mr-2">Narration</label>
        <textarea
          type="text"
          className="p-1 border border-gray-500 w-1/2 rounded-md bg-gray-200"
          value={Narration}
          onChange={(e) => setNarration(e.target.value)}
        />
      </div>
      <div className="text-center mt-8">
        <button
          onClick={handleSave}
          className="bg-black text-white py-2 px-16 rounded text-xl font-bold hover:bg-gray-700"
        >
          Save
        </button>
      </div>
      <ToastContainer />
    </div>
  )
}

export default PayIn
