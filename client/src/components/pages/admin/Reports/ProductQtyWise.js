import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../../context/Auth'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const ProductQtyWise = () => {
  const [productData, setProductData] = useState([])
  const [purchaseData, setPurchaseData] = useState([])
  const [salesData, setSalesData] = useState([])

  const [userId, setUserId] = useState(null)
  const [auth] = useAuth()

  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id)
    } else if (auth.user.role === 0) {
      setUserId(auth.user.admin)
    }
  }, [auth])

  useEffect(() => {
    if (userId) {
      fetchProduct()
      fetchPurchaseInvoice()
      fetchSalesInvoice()
    }
  }, [userId])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageproduct/${userId}`)
      setProductData(response.data.data)
    } catch (error) {
      console.error('Error fetching Product data', error)
    }
  }

  const fetchPurchaseInvoice = async () => {
    try {
      const response = await axios.get(
        `/api/v1/purchaseInvoiceRoute/getAllpurchaseinvoice/${userId}`,
      )
      setPurchaseData(response.data.invoices)
    } catch (error) {
      console.error('Error fetching purchase invoices', error)
    }
  }

  const fetchSalesInvoice = async () => {
    try {
      const response = await axios.get(
        `/api/v1/salesInvoiceRoute/getAllsalesinvoice/${userId}`,
      )
      setSalesData(response.data.response)
    } catch (error) {
      console.error('Error fetching sales invoices', error)
    }
  }

  const mergedData = productData?.map((product) => {
    const productPurchaseRows = purchaseData
      ?.flatMap((purchase) => purchase.rows)
      ?.filter((row) => row.itemCode === product.itemCode)

    const inwardQty = productPurchaseRows?.reduce((sum, row) => {
      return sum + (Number(row.qty) || 0)
    }, 0)

    const productSalesRows = salesData
      ?.flatMap((sale) => sale.rows)
      ?.filter((row) => row.itemCode === product.itemCode)

    const outwardQty = productSalesRows?.reduce((sum, row) => {
      return sum + (Number(row.qty) || 0)
    }, 0)

    const closingQty = Number(product.quantity) + inwardQty - outwardQty

    return {
      ...product,
      inwardQty,
      outwardQty,
      closingQty,
    }
  })

  // Function to download the table data as PDF
  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Product Qty Wise Report', 14, 16)

    const tableColumn = [
      'S.No.',
      'Product Name',
      'Opening Qty',
      'Inward Qty',
      'Outward Qty',
      'Closing Qty',
    ]
    const tableRows = []

    mergedData.forEach((product, index) => {
      const productData = [
        index + 1,
        product.productName,
        product.quantity,
        product.inwardQty,
        product.outwardQty,
        product.closingQty,
      ]
      tableRows.push(productData)
    })

    // Adding autoTable for formatted table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Start after title
    })

    doc.save('product_qty_report.pdf')
  }

  const printReport = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5 responsive-container">
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
      <h1 className="text-3xl font-bold text-center mb-10">
        𝙿𝚛𝚘𝚍𝚞𝚌𝚝 𝚀𝚝𝚢 𝚆𝚒𝚜𝚎 𝚁𝚎𝚙𝚘𝚛𝚝
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="p-5  rounded-lg">
          <div className=" p-1 rounded-lg flex flex-wrap gap-1 hide-on-print ">
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
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full shadow-md table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">S.No.</th>
                  <th className="px-4 py-2">Product Name</th>
                  <th className="px-4 py-2">Opening Qty</th>
                  <th className="px-4 py-2">Inward Qty</th>
                  <th className="px-4 py-2">Outward Qty</th>
                  <th className="px-4 py-2">Closing Qty</th>
                </tr>
              </thead>
              <tbody>
                {mergedData?.map((product, index) => (
                  <tr className="text-center" key={product._id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{product.productName}</td>
                    <td className="border px-4 py-2">{product.quantity}</td>
                    <td className="border px-4 py-2">{product.inwardQty}</td>
                    <td className="border px-4 py-2">{product.outwardQty}</td>
                    <td className="border px-4 py-2">{product.closingQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex space-x-2 hide-on-print">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded "
              onClick={downloadPDF}
            >
              Download Report (PDF)
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
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

export default ProductQtyWise
