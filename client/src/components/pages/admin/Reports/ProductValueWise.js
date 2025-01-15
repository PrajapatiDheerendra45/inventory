import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../../context/Auth'
import Select from 'react-select'

const ProductValueWise = () => {
  const [auth] = useAuth()
  const [userId, setUserId] = useState('')
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [salesInvoice, setSalesInvoice] = useState([])
  const [purchaseInvoice, setPurchaseInvoice] = useState([])

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageproduct/${userId}`)
      setProducts(response.data.data)
    } catch (error) {
      console.error('Error fetching Product data', error)
    }
  }

  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id)
    } else if (auth.user.role === 0) {
      setUserId(auth.user.admin)
    }
    if (userId) {
      fetchProduct()
      fetchInvoice()
      fetchPurchaseInvoice()
    }
  }, [auth, userId])

  const handleProductSelect = (selectedOption) => {
    const product = products.find((p) => p.productName === selectedOption.value)
    setSelectedProduct(product)
  }

  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `/api/v1/salesInvoiceRoute/getAllsalesinvoice/${userId}`,
      )
      setSalesInvoice(response.data.response)
    } catch (error) {
      console.log.error('Error fetching sales estimates.')
    }
  }

  const fetchPurchaseInvoice = async () => {
    try {
      const response = await axios.get(
        `/api/v1/purchaseInvoiceRoute/getAllpurchaseinvoice/${userId}`,
      )
      setPurchaseInvoice(response.data.invoices)
    } catch (error) {
      console.log.error(error.response.data.message)
    }
  }

  const getFilteredSalesInvoices = () => {
    return salesInvoice?.filter((invoice) => {
      const invoiceDate = new Date(invoice.date)
      const start = new Date(startDate)
      const end = new Date(endDate)

      return (
        invoice.rows.some(
          (item) => item.productName === selectedProduct?.productName,
        ) &&
        invoiceDate >= start &&
        invoiceDate <= end
      )
    })
  }

  const getFilteredPurchaseInvoices = () => {
    return purchaseInvoice.filter((invoice) => {
      const invoiceDate = new Date(invoice.date)
      const start = new Date(startDate)
      const end = new Date(endDate)
      return (
        invoice.rows.some(
          (item) => item.productName === selectedProduct?.productName,
        ) &&
        invoiceDate >= start &&
        invoiceDate <= end
      )
    })
  }

  const printReport = () => {
    window.print()
  }

  return (
    <div className="min-h-screen shadow-md bg-gray-100 p-5 responsive-container">
      <h1 className="text-3xl font-bold text-center mb-10">
        𝙿𝚛𝚘𝚍𝚞𝚌𝚝 𝚅𝚊𝚕𝚞𝚎 𝚆𝚒𝚜𝚎 𝚁𝚎𝚙𝚘𝚛𝚝
      </h1>

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

      <div className="bg-white shadow-md rounded-lg p-10">
        <div className="shadow-md p-5 rounded-lg">
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

            <div className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Product Name
              </label>
              <Select
                id="product-select"
                value={
                  selectedProduct
                    ? {
                        label: selectedProduct.productName,
                        value: selectedProduct.productName,
                      }
                    : null
                }
                onChange={handleProductSelect}
                options={products.map((product) => ({
                  label: product.productName,
                  value: product.productName,
                }))}
                isSearchable={true}
                placeholder="Select a Product"
                styles={{
                  control: (base) => ({
                    ...base,
                    minWidth: '200px',
                    maxWidth: '500px',
                    fontSize: '14px',
                    minHeight: '34px',
                    height: '34px',
                  }),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full shadow-md table-auto ">
              <thead>
                <tr>
                  <th className="py-2">S.No.</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="border p-1">
                    Opening
                    <div className="flex justify-between">
                      <span>Qty</span> <span>Value</span>
                    </div>
                  </th>
                  <th className="border p-1">
                    Inward
                    <div className="flex justify-between">
                      <span>Qty</span> <span>Value</span>
                    </div>
                  </th>
                  <th className="border p-1">
                    Outward
                    <div className="flex justify-between">
                      <span>Qty</span> <span>Value</span>
                    </div>
                  </th>
                  <th className="border p-1">
                    Closing
                    <div className="flex justify-between">
                      <span>Qty</span> <span>Value</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="border py-2">1</td>
                  <td className="border">
                    <input
                      type="text"
                      readOnly
                      className="w-full flex-grow border border-black rounded-md"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <div className="p-1 flex gap-1">
                      <input
                        type="text"
                        value={selectedProduct?.quantity || ''}
                        readOnly
                        className="w-full flex-grow border border-black rounded-md"
                      />
                      <input
                        type="text"
                        value={selectedProduct?.amount || ''}
                        readOnly
                        className="w-full flex-grow border border-black rounded-md"
                      />
                    </div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="p-1 flex gap-1">
                      <input
                        type="text"
                        readOnly
                        className="w-full flex-grow border border-black rounded-md"
                      />
                      <input
                        type="text"
                        readOnly
                        className="w-full flex-grow border border-black rounded-md"
                      />
                    </div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="p-1 flex gap-1">
                      <input
                        type="text"
                        readOnly
                        className="w-full flex-grow border border-black rounded-md"
                      />
                      <input
                        type="text"
                        readOnly
                        className="w-full flex-grow border border-black rounded-md"
                      />
                    </div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="p-1 flex gap-1">
                      <input
                        type="text"
                        value={selectedProduct?.quantity || ''}
                        readOnly
                        className="w-full flex-grow border border-black rounded-md"
                      />
                      <input
                        type="text"
                        value={selectedProduct?.amount || ''}
                        readOnly
                        className="w-full flex-grow border border-black rounded-md"
                      />
                    </div>
                  </td>
                </tr>
                {getFilteredSalesInvoices()?.map((invoice, index) => (
                  <tr key={`sales-${index}`} className="text-center">
                    <td className="border py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{invoice.date}</td>
                    <td className="border px-4 py-2">
                      <div className="p-1 flex gap-1">
                        <input
                          type="text"
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                        <input
                          type="text"
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="p-1 flex gap-1">
                        <input
                          type="text"
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                        <input
                          type="text"
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="p-1 flex gap-1">
                        <input
                          type="text"
                          value={invoice.rows[0].qty || ''}
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                        <input
                          type="text"
                          value={invoice?.netAmount || ''}
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="p-1 flex gap-1">
                        <input
                          type="text"
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                        <input
                          type="text"
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Purchase Invoices */}
                {getFilteredPurchaseInvoices()?.map((invoice, index) => (
                  <tr key={`sales-${index}`} className="text-center">
                    <td className="border py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{invoice.date}</td>
                    <td className="border px-4 py-2">
                      <div className="p-1 flex gap-1">
                        <input
                          type="text"
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                        <input
                          type="text"
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="p-1 flex gap-1">
                        <input
                          type="text"
                          value={invoice.rows[0].qty || ''}
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                        <input
                          type="text"
                          value={invoice.netAmount || ''}
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="p-1 flex gap-1">
                        <input
                          type="text"
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                        <input
                          type="text"
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="p-1 flex gap-1">
                        <input
                          type="text"
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                        <input
                          type="text"
                          readOnly
                          className="w-full flex-grow border border-black rounded-md"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex space-x-2">
            <button className="bg-pink-500 text-white px-4 py-2 rounded hide-on-print ">
              Download Report
            </button>
            <button
              className="bg-pink-500 text-white px-4 py-2 rounded hide-on-print"
              onClick={printReport}
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductValueWise
