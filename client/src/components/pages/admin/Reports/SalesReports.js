import React from "react";
import { Link } from "react-router-dom";

const SalesReports = () => {
  return (
    <div className="bg-gray-100 p-5 responsive-container">
      <h1 className="text-4xl font-bold text-center mb-10">𝚂𝚊𝚕𝚎𝚜 𝚁𝚎𝚙𝚘𝚛𝚝</h1>

      {/* Buttons to select report */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 justify-center mb-10">
        <Link to="/admin/InvoicewiseSales">
          <button className="w-full h-64 rounded-lg bg-blue-100 hover:bg-blue-500 hover:text-white text-3xl">
            Invoice wise sales
          </button>
        </Link>

        <Link to="/admin/CustomerWiseReport">
          <button className="w-full h-64 rounded-lg bg-pink-100 hover:bg-pink-500 hover:text-white text-3xl">
            Customer wise report
          </button>
        </Link>
{/* 
        <Link to="/admin/ManufacturerWise">
          <button className="w-full h-64 rounded-lg bg-green-100 hover:bg-green-500 hover:text-white text-3xl">
            Manufacturer wise report
          </button>
        </Link> */}

        <Link to="/admin/PointOfSalesReport">
          <button className="w-full h-64 rounded-lg bg-red-100 hover:bg-red-500 hover:text-white text-3xl">
            Point of sales report
          </button>
        </Link>

        {/* <Link to="/admin/SalesRegister">
          <button className="w-full h-64 rounded-lg bg-orange-100 hover:bg-orange-500 hover:text-white text-3xl">
            Sales Register
          </button>
        </Link> */}

        <Link to="/admin/CustomerLedger">
          <button className="w-full h-64 rounded-lg bg-yellow-100 hover:bg-yellow-500 hover:text-white text-3xl">
            Customer Ledger
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SalesReports;
