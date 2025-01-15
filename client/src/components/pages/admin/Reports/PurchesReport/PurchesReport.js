import React from "react";
import { Link } from "react-router-dom";

const PurchesReport = () => {
  return (
    <div className="bg-gray-100 p-5 responsive-container">
      <h1 className="text-4xl font-bold text-center mb-10">𝙿𝚞𝚛𝚌𝚑𝚎𝚜 𝚁𝚎𝚙𝚘𝚛𝚝</h1>

      {/* Buttons to select report */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 justify-center mb-10">
        <Link to="/admin/Invoicewisepurches">
          <button className="w-full h-64 rounded-lg bg-blue-100 hover:bg-blue-500 hover:text-white text-3xl">
            Invoice wise Purches
          </button>
        </Link>

        <Link to="/admin/supplierWiseReport">
          <button className="w-full h-64 rounded-lg bg-pink-100 hover:bg-pink-500 hover:text-white text-3xl">
            Supplier wise report
          </button>
        </Link>

        {/* <Link to="/admin/ManufacturerWisereport">
          <button className="w-full h-64 rounded-lg bg-green-100 hover:bg-green-500 hover:text-white text-3xl">
            Manufacturer wise report
          </button>
        </Link> */}
{/* 
        <Link to="/admin/purchesregister">
          <button className="w-full h-64 rounded-lg bg-red-100 hover:bg-red-500 hover:text-white text-3xl">
            Purches Register
          </button>
        </Link> */}

        <Link to="/admin/supplierledger">
          <button className="w-full h-64 rounded-lg bg-orange-100 hover:bg-orange-500 hover:text-white text-3xl">
            Supplier Ledger
          </button>
        </Link>

      </div>
    </div>
  );
};

export default PurchesReport;
