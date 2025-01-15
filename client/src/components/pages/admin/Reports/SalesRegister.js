import React from 'react';

const SalesRegister = () => {
  return (
    <div className="p-5 bg-blue-900 text-black responsive-container">
      <h1 className="text-2xl font-bold mb-5">Sales register</h1>
      {/* Sales Summary Table */}
      <table className="table-auto w-full border border-black">
        <thead>
          <tr>
            <th className="p-2 border border-black">Month</th>
            <th className="p-2 border border-black">Debit</th>
            <th className="p-2 border border-black">Credit</th>
            <th className="p-2 border border-black">Closing</th>
          </tr>
        </thead>
        <tbody>
          {['April', 'May', 'June', 'July'].map((month, index) => (
            <tr key={index}>
              <td className="p-2 border border-black">{month}</td>
              <td className="p-2 border border-black"></td>
              <td className="p-2 border border-black"></td>
              <td className="p-2 border border-black"></td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-5 text-center text-black">after click on any month detailed sales register will open</p>

      {/* Detailed Sales Register */}
      <table className="table-auto w-full mt-5 border border-black">
        <thead>
          <tr>
            <th className="p-2 border border-black">Date</th>
            <th className="p-2 border border-black">Particular</th>
            <th className="p-2 border border-black">Invoice No.</th>
            <th className="p-2 border border-black">Voucher Type</th>
            <th className="p-2 border border-black">Debit</th>
            <th className="p-2 border border-black">Credit</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4].map((day, index) => (
            <tr key={index}>
              <td className="p-2 border border-black">{`${day}-4-2024`}</td>
              <td className="p-2 border border-black"></td>
              <td className="p-2 border border-black"></td>
              <td className="p-2 border border-black"></td>
              <td className="p-2 border border-black"></td>
              <td className="p-2 border border-black"></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Section */}
      <div className="flex justify-between p-5 mt-5 bg-blue-700 border-t-2 border-black">
        <span>Total</span>
        <span className="font-bold">Bold</span>
        <span className="font-bold">Bold</span>
      </div>
    </div>
  );
};

export default SalesRegister;
