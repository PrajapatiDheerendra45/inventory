import React, { useState, useEffect } from "react";
import Select from "react-select"; // Ensure react-select is installed
import { ToastContainer } from "react-toastify"; // Ensure react-toastify is installed
import "react-toastify/dist/ReactToastify.css"; 

const InvoiceModal = ({ invoice1, onClose }) => {
  const [invoice, setInvoice] = useState(invoice1);

  useEffect(() => {
    setInvoice(invoice1);
  }, [invoice1]);

  // Handlers for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice({ ...invoice, [name]: value });
  };

  const handleRowChange = (index, key, value) => {
    const updatedRows = [...invoice.rows];
    updatedRows[index][key] = value;
    setInvoice({ ...invoice, rows: updatedRows });
  };

  const removeRow = (index) => {
    const updatedRows = invoice.rows.filter((_, i) => i !== index);
    setInvoice({ ...invoice, rows: updatedRows });
  };

  return (
    <div className="fixed w-full h-full inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        style={{ backgroundColor: "#FFFFFF", color: "black" }}
        className="responsive-container bg-pink-200 p-4 rounded-md w-full mx-auto"
      >
        <h1 className="text-center text-4xl mb-5 text-black font-bold cucolor">
          𝙿𝚘𝚒𝚗𝚝 𝙾𝚏 𝚂𝚊𝚕𝚎
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-md font-bold text-black">Date</label>
            <input
              type="date"
              name="date"
              value={invoice.date}
              onChange={handleChange}
              readOnly
              className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-md font-bold text-black">Invoice No.</label>
            <input
              type="text"
              name="invoicNo"
              value={invoice.invoicNo}
              onChange={handleChange}
              readOnly
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
              value={invoice.customerDetail}
              onChange={handleChange}
              readOnly
              className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
              placeholder="Contact or name"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-md font-bold text-black">Payment Type</label>
            <input
              name="paymentType"
              onChange={handleChange}
              value={invoice.paymentType}
              readOnly
              className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
            ></input>
          </div>
        </div>

        <div className="overflow-x-auto mt-5">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-1">#</th>
                <th className="border text-bold text-sm">Item Code</th>
                <th className="border">Product Name</th>
                <th className="border p-1">Qty</th>
                <th className="border p-1">MRP</th>
                <th className="border p-1">Retail Price</th>
                <th className="border p-2">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {invoice.rows.map((row, index) => (
                <tr key={index}>
                  <td className="border p-1">{index + 1}</td>
                  <td className="border">
                    <input
                      id="itemcode-select"
                      value={row.itemCode}
                      readOnly
                      // onChange={(selectedOption) => handleRowChange(index, 'itemCode', selectedOption.value)}

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
                      }}
                    />
                  </td>
                  <td className="border">
                    <input
                      id="product-select"
                      readOnly
                      value={row.productName}
                      // onChange={(selectedOption) => handleRowChange(index, 'productName', selectedOption.value)}
                      options={[
                        {
                          label: "Product A fsf fdf",
                          value: "Product A fsf fdf",
                        },
                        { label: "Product B", value: "Product B" },
                        // Add more products as needed
                      ]}
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
                      }}
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      readOnly
                      value={row.qty}
                      onChange={(e) =>
                        handleRowChange(index, "qty", e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      readOnly
                      value={row.mrp}
                      onChange={(e) =>
                        handleRowChange(index, "mrp", e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      readOnly
                      value={row.retailPrice}
                      onChange={(e) =>
                        handleRowChange(index, "retailPrice", e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      value={row.totalValue}
                      readOnly
                      className="w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-end gap-5 mt-10">
          <div className="flex flex-row justify-left gap-3">
            <label className="text-1xl font-bold text-black mt-2">
              Gross Amount
            </label>
            <input
              type="text"
              value={invoice.grossAmount}
              className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
              placeholder="Gross Amount"
              readOnly
            />
          </div>
          <div className="flex flex-row justify-left gap-3">
            <label className="text-1xl font-bold text-black mt-2">
              GST Amount
            </label>
            <input
              type="text"
              value={invoice.GstAmount}
              className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
              placeholder="GST Amount"
              readOnly
            />
          </div>
          <div className="flex flex-row justify-left gap-3">
            <label className="text-1xl font-bold text-black mt-2">
              Net Amount
            </label>
            <input
              type="text"
              value={invoice.netAmount}
              className="mt-1 p-1 border border-gray-500 rounded-md bg-gray-200"
              placeholder="Net Amount"
              readOnly
            />
          </div>
        </div>

        <ToastContainer />
        <button
          onClick={onClose}
          className="bg-blue-500 text-white p-2 px-10  rounded mt-5 hover:bg-blue-600 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InvoiceModal;
