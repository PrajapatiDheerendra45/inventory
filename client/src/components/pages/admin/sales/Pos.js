import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import { useAuth } from "../../../context/Auth.js";
const Pos = () => {
  const [rows, setRows] = useState([]);
  const calculateTotals = () => {
    let grossAmount = 0;
    let GstAmount = 0;
    rows.forEach((rows) => {
      grossAmount += rows.taxableValue;
      GstAmount += rows.cgstrs + rows.sgstrs;
    });
    let netAmount;
    netAmount = grossAmount + GstAmount;
    return { grossAmount, GstAmount, netAmount };
  };
  const [auth] =useAuth();
  const [userId ,setUserId] =useState("");
  const [date, setDate] = useState("");
  const [products, setProducts] = useState([]);
  const { grossAmount, GstAmount, netAmount } = calculateTotals();

  const [gstType, setGstType] = useState("CGST/SGST");

  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const [formData, setFormData] = useState({
    date: "",
    invoicNo: "",
    customerDetail: "",
    paymentType: "",
    rows: [
      {
        itemCode: "",
        productName: "",
        qty: null,
        unit: null,
        mrp: null,
        retailPrice: null,
        totalValue: null,
      },
    ],
    grossAmount: "",
    CGSTAmount: "",
    SGSTAmount: "",

    netAmount: "",
  });




  useEffect(()=>{

    if (auth?.user) {
      if (auth.user.role === 1) {
        setUserId(auth.user._id);
      } else if (auth.user.role === 0) {
        setUserId(auth.user.admin);
      }
    }
    fetchCustomer();
    fetchProducts();

  },[auth,userId])
  
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/manageproduct/${userId}`);
     
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
     
    }
  };


    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/manageCustomer/${userId}`);
      
        setCustomer(response.data.data);
      } catch (error) {
        console.error("Error fetching Customers:", error);
      }
    };




  const handleProductSelect = (rowIndex, selectedProductName) => {
    const selectedProduct = products.find(
      (product) => product.productName === selectedProductName
    );
   
    if (selectedProduct) {
      const updatedRows = [...rows];

      // Calculate retail price
      const retailPrice =
        selectedProduct.maxmimunRetailPrice -
        (selectedProduct.maxmimunRetailPrice * selectedProduct.retailDiscount) /
          100;

      // Determine if sales tax is included from the fetched product data
      const salesTaxInclude = selectedProduct.salesTaxInclude;
      const taxableValue = salesTaxInclude
        ? (selectedProduct.retailPrice * selectedProduct.quantity * 100) /
          (100 + Number(selectedProduct.gstRate))
        : retailPrice * selectedProduct.quantity;

      // Update the row with the new values

      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        itemCode: selectedProduct.itemCode,
        hsnCode: selectedProduct.hsnCode,
        unit: selectedProduct.unit,
        productName: selectedProduct.productName,
        maxmimunRetailPrice: selectedProduct.maxmimunRetailPrice
          ? parseFloat(selectedProduct.maxmimunRetailPrice).toFixed(2)
          : "0.00",
        quantity: selectedProduct.quantity,
        wholesalerDiscount: selectedProduct.wholesalerDiscount,
        wholeselerDiscountRS:
          (selectedProduct.maxmimunRetailPrice *
            selectedProduct.wholesalerDiscount) /
          100,
        retailDiscount: selectedProduct.retailDiscount,
        retailDiscountRS:
          (selectedProduct.maxmimunRetailPrice *
            selectedProduct.retailDiscount) /
          100,

        taxableValue: taxableValue,
        retailPrice: retailPrice,

        retailPricer: selectedProductName.retailPrice,
        cgstp: selectedProduct.gstRate / 2,
        sgstp: selectedProduct.gstRate / 2,
        igstp: selectedProduct.gstRate,

        cgstrs: parseFloat(
          ((taxableValue * (selectedProduct.gstRate / 2)) / 100).toFixed(2)
        ),
        sgstrs: parseFloat(
          ((taxableValue * (selectedProduct.gstRate / 2)) / 100).toFixed(2)
        ),
        igstrs: parseFloat(
          ((taxableValue * selectedProduct.gstRate) / 100).toFixed(2)
        ),

        totalvalue: (
          taxableValue +
          (taxableValue * selectedProduct.gstRate) / 100
        ).toFixed(2),
      };

      setRows(updatedRows);
    }
  };

  const handleItemCodeSelect = (rowIndex, selectedItemCode) => {
    const selectedProduct = products.find(
      (product) => product.itemCode === selectedItemCode
    );

    if (selectedProduct) {
      const updatedRows = [...rows];

      // Calculate retail price and taxable value based on the product details
      const retailPrice =
        selectedProduct.maxmimunRetailPrice -
        (selectedProduct.maxmimunRetailPrice * selectedProduct.retailDiscount) /
          100;

      const taxableValue = selectedProduct.salesTaxInclude
        ? (retailPrice * selectedProduct.quantity * 100) /
          (100 + selectedProduct.gstRate)
        : retailPrice * selectedProduct.quantity;

      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        itemCode: selectedProduct.itemCode,
        productName: selectedProduct.productName,
        hsnCode: selectedProduct.hsnCode,
        unit: selectedProduct.unit,
        maxmimunRetailPrice: selectedProduct.maxmimunRetailPrice
          ? parseFloat(selectedProduct.maxmimunRetailPrice).toFixed(2)
          : "0.00",
        quantity: selectedProduct.quantity,
        wholesalerDiscount: selectedProduct.wholesalerDiscount,
        wholeselerDiscountRS: (
          (selectedProduct.maxmimunRetailPrice *
            selectedProduct.wholesalerDiscount) /
          100
        ).toFixed(2),
        retailDiscount: selectedProduct.retailDiscount,
        retailDiscountRS: (
          (selectedProduct.maxmimunRetailPrice *
            selectedProduct.retailDiscount) /
          100
        ).toFixed(2),
        taxableValue: taxableValue,
        cgstp: selectedProduct.gstRate / 2,
        sgstp: selectedProduct.gstRate / 2,
        igstp: selectedProduct.gstRate,
        retailPrice: retailPrice,

        cgstrs: parseFloat(
          ((taxableValue * (selectedProduct.gstRate / 2)) / 100).toFixed(2)
        ),
        sgstrs: parseFloat(
          ((taxableValue * (selectedProduct.gstRate / 2)) / 100).toFixed(2)
        ),
        igstrs: parseFloat(
          ((taxableValue * selectedProduct.gstRate) / 100).toFixed(2)
        ),

        totalvalue: (
          taxableValue +
          (taxableValue * selectedProduct.gstRate) / 100
        ).toFixed(2),
      };

      setRows(updatedRows);
    }
  };

  const handleRowChange = (index, field, value) => {
    const newRows = [...rows];
    const newValue = parseFloat(value) || 0;
    newRows[index] = { ...newRows[index], [field]: newValue };

    // Calculate taxable value, GST, and total value
    const { qty, mrp, discount } = newRows[index];
    const taxableValue = qty * mrp - discount;
    const cgst = gstType === "CGST/SGST" ? taxableValue * 0.09 : 0;
    const sgst = gstType === "CGST/SGST" ? taxableValue * 0.09 : 0;
    const igst = gstType === "IGST" ? taxableValue * 0.18 : 0;
    const totalValue = taxableValue + cgst + sgst + igst;

    newRows[index] = {
      ...newRows[index],
      taxableValue,
      cgst,
      sgst,
      igst,
      totalValue,
    };
    setRows(newRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        itemCode: "",
        productName: "",

        qty: 0,
        uom: "",
        mrp: 0,
        retailPrice: 0,
        discount: 0,
        taxableValue: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalValue: 0,
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const updatedFormData = {
        ...formData,
        userId:userId,
        rows: rows.map((row) => ({
          itemCode: row.itemCode,
          productName: row.productName,
          qty: row.quantity,
          units: row.unit,
          retailPrice: row.retailPrice,
          mrp: row.maxmimunRetailPrice,
          taxable: row.taxableValue.toFixed(2),
          cgstpercent: row.cgstp,
          cgstRS: row.cgstrs,
          sgstpercent: row.sgstp,
          sgstRS: row.sgstrs,
          igstpercent: row.igstp,
          igstRS: row.igstrs,
          totalValue: row.totalvalue,
        })),
        grossAmount: grossAmount.toFixed(2),
        GstAmount: GstAmount.toFixed(2),
        netAmount: netAmount.toFixed(2),
      };
  
      const response = await axios.post(
        "/api/v1/pointOfSaleRoute/createsalespof",
        updatedFormData
      );
    
  
      if (response) {
        toast.success("Point Of SALE created successfully...");
      }
  
      // Reset formData
      setFormData({
        date: "",
        invoicNo: "",
        customerDetail: "", // Reset customerDetail
        paymentType: "",
        rows: [
          {
            itemCode: "",
            productName: "",
            qty: null,
            uom: null,
            mrp: null,
            retailPrice: null,
            discount: null,
            cgst: null,
            sgst: null,
            igst: null,
            totalValue: null,
          },
        ],
        grossAmount: "",
        GstAmount: "",
        netAmount: "",
      });
  
      setDate("");
      setRows([]);
      setSelectedCustomer("");
      window.print();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create point of sale estimate. Please try again.");
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Correctly update the formData field
    });
  };
  
  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const print = () => {
    window.print();
  };

  return (
    <div
      style={{ backgroundColor: "#FFFFFF", color: "black" }}
      className="responsive-container bg-pink-200 p-4 rounded-md w-full mx-auto"
    >
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
      <h1 className="text-center text-4xl  mb-5 text-black font-bold cucolor">
        𝙿𝚘𝚒𝚗𝚝 𝙾𝚏 𝚂𝚊𝚕𝚎
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-md font-bold text-black">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => {
              setDate(e.target.value);
              handleChange(e);
            }}
            className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-md font-bold text-black">Invoice No.</label>
          <input
            type="text"
            name="invoicNo"
            value={formData.invoicNo}
            onChange={handleChange} // Remove unnecessary setDate
            className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-md font-bold text-black">
            Customer Detail
          </label>
          <input
            type="text"
            name="customerDetail"
            value={formData.customerDetail}
            onChange={handleChange} // Remove unnecessary setDate
            className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200 "
            placeholder="Contact or name"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-md font-bold text-black">Payment Type</label>
          <select
            name="paymentType"
            onChange={(e) => {
              setDate(e.target.value);
              handleChange(e);
            }}
            value={formData.paymentType}
            className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
          >
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="w-full border-collapse overflow-x-auto">
          <thead>
            <tr>
              <th className="border p-1">#</th>
              <th className="border text-bold text-sm ">Item Code</th>
              <th className="border ">Product Name</th>

              <th className="border p-1">Qty</th>
              <th className="border p-1">unit</th>
              <th className="border p-1">MRP</th>
              <th className="border p-2">Retail Price</th>
              <th className="border p-2">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {console.log(rows, "row")}
                <td className="border p-1">{index + 1}</td>
                <td className="border">
                  <Select
                    id="itemcode-select"
                    value={
                      rows[index].itemCode
                        ? {
                            label: rows[index].itemCode,
                            value: rows[index].itemCode,
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleItemCodeSelect(index, selectedOption.value)
                    }
                    options={products.map((product) => ({
                      label: product.itemCode,
                      value: product.itemCode,
                    }))}
                    isSearchable={true}
                    placeholder="Select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minWidth: "120px",
                        maxWidth: "300px",
                        fontSize: "14px",
                        minHeight: "34px",
                        height: "34px",
                      }),
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
                </td>

                <td className="border ">
                  {console.log(rows, "dheeru")}
                  <Select
                    id="product-select"
                    value={
                      rows[index].productName
                        ? {
                            label: rows[index].productName,
                            value: rows[index].productName,
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleProductSelect(index, selectedOption.value)
                    }
                    options={products.map((product) => ({
                      label: product.productName,
                      value: product.productName,
                    }))}
                    isSearchable={true}
                    placeholder="Select a Product"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minWidth: "200px",
                        maxWidth: "500px",
                        fontSize: "14px",
                        minHeight: "34px",
                        height: "34px",
                      }),
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
                </td>

                <td className="border p-1">
                  <input
                    type="text"
                    value={row.quantity}
                    onChange={(e) =>
                      handleRowChange(index, "quantity", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="text"
                    value={row.unit}
                    onChange={(e) =>
                      handleRowChange(index, "unit", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={row.maxmimunRetailPrice}
                    onChange={(e) =>
                      handleRowChange(
                        index,
                        "maxmimunRetailPrice",
                        e.target.value
                      )
                    }
                    className="w-full flex-grow"
                    style={{
                      minWidth: "70px", // Set a small minimum width to ensure visibility
                      flexBasis: "70px", // Allow it to shrink, but still have a base width
                      flexShrink: 1, // Allow it to shrink on mobile
                    }}
                  />
                </td>

                <td className="border">
                  <div className="p-1 flex gap-1">
                    <input
                      type="text"
                      value={row.retailPrice}
                      onChange={(e) =>
                        handleRowChange(
                          index,
                          "discountpercent",
                          e.target.value
                        )
                      }
                      className="w-full flex-grow"
                      style={{
                        minWidth: "20px", // Set a small minimum width to ensure visibility
                        flexBasis: "20px", // Allow it to shrink, but still have a base width
                        flexShrink: 1, // Allow it to shrink on mobile
                      }}
                    />
                  </div>
                </td>

                <td className="border p-1">
                  <input
                    type="text"
                    value={row.totalvalue}
                    onChange={(e) =>
                      handleRowChange(index, "totalValue", e.target.value)
                    }
                    className="w-full flex-grow"
                    style={{
                      minWidth: "70px",
                      flexBasis: "70px",
                      flexShrink: 1,
                    }}
                  />
                </td>
                <td className="p-1 gap-2 flex">
                  <button
                    onClick={() => removeRow(index)}
                    className="bg-red-500 text-black p-1 mt-2 hide-on-print rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={addRow}
        className="bg-green-500 text-black hide-on-print p-2 mt-2 rounded hoverbg-green-600 focusoutline-none focusring-2 focusring-green-400 focusring-opacity-50 flex items-center justify-center"
      >
        <svg
          xmlns="http//www.w3.org/2000/svg"
          className="h-4 w-4 "
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add New Row
      </button>

      <div className="flex flex-col items-end gap-5 mt-10">
        <div className="flex flex-row justify-left  gap-3">
          <label className="text-1xl font-bold text-black mt-2">
            Gross Amount
          </label>
          <input
            type="text"
            value={grossAmount.toFixed(2)}
            className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
            placeholder="Gross Amount"
          />
        </div>
        <div className="flex flex-row justify-left  gap-3">
          <label className="text-1xl font-bold text-black mt-2">
            CGST Amount
          </label>
          <input
            type="text"
            value={(GstAmount / 2).toFixed(2)}
            className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
            placeholder="GST Amount"
          />
        </div>
        <div className="flex flex-row justify-left  gap-3">
          <label className="text-1xl font-bold text-black mt-2">
            SGST Amount
          </label>
          <input
            type="text"
            value={(GstAmount / 2).toFixed(2)}
            className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
            placeholder="GST Amount"
          />
        </div>
        <div className="flex flex-row justify-left  gap-3">
          <label className="text-1xl font-bold text-black mt-2">
            Net Amount
          </label>
          <input
            type="text"
            value={Math.round(netAmount).toFixed(2)}
            className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
            placeholder="Net Amount"
          />
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
          className="bg-black hide-on-print text-white py-2 rounded px-10 text-xl font-bold hover:bg-gray-700"
        >
          Save & Print
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Pos;
