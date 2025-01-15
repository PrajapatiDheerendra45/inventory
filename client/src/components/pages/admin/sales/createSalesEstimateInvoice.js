import React from "react";
import { FaPrint } from "react-icons/fa";

const createSalesEstimateInvoice = () => {
  const handlePrint = () => {
    const printContents = document.getElementById("createSalesEstimateInvoice").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  return (
    <div className="p-8">
      <div id="createSalesEstimateInvoice" className="bg-white p-4 rounded shadow-lg max-w-4xl mx-auto border">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-red-600">Business Name</h1>
            <p className="text-sm">Address: Your Address</p>
            <p className="text-sm">GSTIN: Your GST Number</p>
          </div>
          <div className="text-right">
            <img src="/path/to/logo.png" alt="Logo" className="w-32 h-auto" />
          </div>
        </div>

        {/* Customer, Sales Estimate, and Transport Details */}
        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
          <div className="border p-2">
            <h2 className="font-bold text-green-600 mb-2">Customer Details</h2>
            <p>Name:</p>
            <p>Address:</p>
            <p>Contact:</p>
            <p>GSTIN:</p>
          </div>
          <div className="border p-2">
            <h2 className="font-bold text-blue-600 mb-2">Sales Estimate</h2>
            <p>Estimate No:</p>
            <p>Estimate Date:</p>
            <p>Place of Supply:</p>
          </div>
          <div className="border p-2">
            <h2 className="font-bold text-blue-600 mb-2">Transport Details</h2>
            <p>Receipt Doc No:</p>
            <p>Dispatch Through:</p>
            <p>Agent Name:</p>
            <p>Vehicle Number:</p>
          </div>
        </div>

        {/* Table Section */}
        <table className="table-auto w-full border mb-4 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">No.</th>
              <th className="border px-2 py-1">Product Name</th>
              <th className="border px-2 py-1">HSN Code</th>
              <th className="border px-2 py-1">QTY</th>
              <th className="border px-2 py-1">UOM</th>
              <th className="border px-2 py-1">MRP</th>
              <th className="border px-2 py-1">Disc. %</th>
              <th className="border px-2 py-1">Rate</th>
              <th className="border px-2 py-1">Taxable Value</th>
              <th className="border px-2 py-1">CGST %</th>
              <th className="border px-2 py-1">CGST ₹</th>
              <th className="border px-2 py-1">SGST %</th>
              <th className="border px-2 py-1">SGST ₹</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {/* Populate with your items */}
            <tr>
              <td className="border px-2 py-1">1</td>
              <td className="border px-2 py-1">Product Name</td>
              <td className="border px-2 py-1">1234</td>
              <td className="border px-2 py-1">10</td>
              <td className="border px-2 py-1">KG</td>
              <td className="border px-2 py-1">500</td>
              <td className="border px-2 py-1">10%</td>
              <td className="border px-2 py-1">450</td>
              <td className="border px-2 py-1">4500</td>
              <td className="border px-2 py-1">9%</td>
              <td className="border px-2 py-1">405</td>
              <td className="border px-2 py-1">9%</td>
              <td className="border px-2 py-1">405</td>
              <td className="border px-2 py-1">5310</td>
            </tr>
          </tbody>
        </table>

        {/* Banking Details and Amount Section */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="col-span-2 border p-2">
            <h2 className="font-bold text-blue-600 mb-2">Banking Details</h2>
            <p>Bank Name:</p>
            <p>IFSC Code:</p>
            <p>Account No:</p>
            <p>Account Holder Name:</p>
            <p>UPI ID:</p>
          </div>
          <div className="border p-2">
            <h2 className="font-bold text-blue-600 mb-2">Amount Details</h2>
            <p>Gross Total: ₹</p>
            <p>GST Amount: ₹</p>
            <p>Additional Charges: ₹</p>
            <p>Net Total: ₹</p>
            <p>Amount in Words:</p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="border p-2 mt-4">
          <h2 className="font-bold text-red-600 mb-2">Terms & Conditions</h2>
          <p>Your terms and conditions go here...</p>
        </div>

        {/* Signature Section */}
        <div className="flex justify-end mt-4">
          <div className="text-right">
            <p>For (Business Name)</p>
            <br />
            <p>Signature</p>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded flex items-center"
      >
        <FaPrint className="mr-2" />
        Print createSalesEstimateInvoice
      </button>
    </div>
  );
};

export default createSalesEstimateInvoice;
