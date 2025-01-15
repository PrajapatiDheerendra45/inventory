import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const StockReports = () => {
  const [activeReport, setActiveReport] = useState('')

  const handleReportChange = (report) => {
    setActiveReport(report)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5 responsive-container">
      <h1 className="  text-center mb-10 font-bold text-4xl">𝚂𝚃𝙾𝙲𝙺 𝚁𝙴𝙿𝙾𝚁𝚃 </h1>

      {/* Buttons to select report */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 justify-center mb-10">
        <Link to="/admin/ProductQtyWise">
          <button
            className={`px-6 py-28 rounded-lg bg-blue-100 hover:bg-blue-500 hover:text-white shadow-md text-2xl  `}
          >
            𝙿𝚛𝚘𝚍𝚞𝚌𝚝 𝚀untity 𝚆𝚒𝚜𝚎 𝚁𝚎𝚙𝚘𝚛𝚝
          </button>
        </Link>
        <Link to="/admin/ProductValueWise">
          <button
            className={`px-6 py-28 rounded-lg bg-pink-100 hover:bg-pink-500 hover:text-white  shadow-md text-2xl  `}
          >
            𝙿𝚛𝚘𝚍𝚞𝚌𝚝 𝚅𝚊𝚕𝚞𝚎 𝚆𝚒𝚜𝚎 𝚁𝚎𝚙𝚘𝚛𝚝
          </button>
        </Link>
        {/* <Link to="/admin/ManufacturerW">
          <button className="px-6 py-28 rounded-lg bg-green-100 hover:bg-green-500 hover:text-white shadow-md text-2xl ">
          𝙼𝚊𝚗𝚞𝚏𝚊𝚌𝚝𝚞𝚛𝚎𝚛 𝚆𝚒𝚜𝚎 𝚁𝚎𝚙𝚘𝚛𝚝
          </button>
        </Link> */}
      </div>
    </div>
  )
}

export default StockReports
