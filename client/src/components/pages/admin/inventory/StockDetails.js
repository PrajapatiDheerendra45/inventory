import React from 'react';


const stockData = [
  { id: 1, name: 'Slim Fit T-shirt 48', brand: 'Lee Cooper', qty: 40, mrp: 1199, costPrice: 799, landingCost: 849 },
  { id: 2, name: 'Slim Fit T-shirt 46', brand: 'Lee Cooper', qty: 40, mrp: 1199, costPrice: 799, landingCost: 849 },
  { id: 3, name: 'Slim Fit T-shirt 44', brand: 'Lee Cooper', qty: 40, mrp: 1199, costPrice: 799, landingCost: 849 },
  { id: 4, name: 'Slim Fit T-shirt 42', brand: 'Lee Cooper', qty: 40, mrp: 1199, costPrice: 799, landingCost: 849 },
  { id: 5, name: 'Slim Fit T-shirt 40', brand: 'Lee Cooper', qty: 40, mrp: 1199, costPrice: 799, landingCost: 849 },
  { id: 6, name: 'Slim Fit T-shirt 38', brand: 'Lee Cooper', qty: 40, mrp: 1199, costPrice: 799, landingCost: 849 },
  { id: 7, name: 'Slim Fit T-shirt 36', brand: 'Lee Cooper', qty: 40, mrp: 1199, costPrice: 799, landingCost: 849 },
  { id: 1, name: 'Slim Fit T-shirt 48', brand: 'Lee Cooper', qty: 40, mrp: 1199, costPrice: 799, landingCost: 849 },
  { id: 2, name: 'Slim Fit T-shirt 46', brand: 'Lee Cooper', qty: 40, mrp: 1199, costPrice: 799, landingCost: 849 },
  { id: 3, name: 'Slim Fit T-shirt 44', brand: 'Lee Cooper', qty: 40, mrp: 1199, costPrice: 799, landingCost: 849 },
  { id: 4, name: 'Slim Fit T-shirt 42', brand: 'Lee Cooper', qty: 40, mrp: 1199, costPrice: 799, landingCost: 849 },

];

const StockDetails = () => {
  const calculateTotal = (key) => {
    return stockData.reduce((total, item) => total + item[key], 0);
  };

  return (
    <div className="responsive-container mx-auto p-4">
      <h2 className="text-center text-green-600 text-2xl font-semibold mb-4">Stock Details</h2>
      <div className="flex justify-between mb-4">
        <button className="bg-gray-300 text-black py-2 px-4 rounded">Filter</button>
        <button className="bg-gray-300 text-black py-2 px-4 rounded">Search</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 borde text-white bg-purple-700">S.no</th>
              <th className="px-4 py-2 border  text-white bg-purple-700">Product Name</th>
              <th className="px-4 py-2 border  text-white bg-purple-700">Brand Name</th>
              <th className="px-4 py-2 border  text-white bg-purple-700">Available Qty</th>
              <th className="px-4 py-2 border  text-white bg-purple-700">MRP</th>
              <th className="px-4 py-2 border  text-white bg-purple-700">Cost Price</th>
              <th className="px-4 py-2 border  text-white bg-purple-700">Landing Cost</th>
              <th className="px-4 py-2 border  text-white bg-purple-700">Stock Value</th>
              <th className="px-4 py-2 border  text-white bg-purple-700">Landing Stock Value</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((item, index) => (
              <tr key={item.id} className="text-center">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border  text-purple-700">{item.name}</td>
                <td className="px-4 py-2 border">{item.brand}</td>
                <td className="px-4 py-2 border">{item.qty}</td>
                <td className="px-4 py-2 border">{item.mrp}</td>
                <td className="px-4 py-2 border">{item.costPrice}</td>
                <td className="px-4 py-2 border">{item.landingCost}</td>
                <td className="px-4 py-2 border">{item.costPrice * item.qty}</td>
                <td className="px-4 py-2 border">{item.landingCost * item.qty}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="text-center font-semibold">
              <td className="px-4 py-2 border" colSpan="3">TOTAL</td>
              <td className="px-4 py-2 border">{calculateTotal('qty')}</td>
              <td className="px-4 py-2 border"></td>
              <td className="px-4 py-2 border"></td>
              <td className="px-4 py-2 border"></td>
              <td className="px-4 py-2 border">{calculateTotal('costPrice') * stockData[0].qty}</td>
              <td className="px-4 py-2 border">{calculateTotal('landingCost') * stockData[0].qty}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default StockDetails;
