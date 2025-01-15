import React, { useState, useRef, useEffect } from "react";
import {
  FaChartBar,
  FaMoneyBill,
  FaUsers,
  FaShoppingCart,
  FaBuilding,
  FaMoneyCheckAlt,
  FaClipboardList,
  FaMoneyBillAlt,
  FaCubes,
  FaUserFriends,
  FaMoneyCheck,
  FaCashRegister,
  FaPiggyBank,
  FaDollarSign,
  FaCalculator,
} from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/Auth";
const Home = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [auth] = useAuth();
  const [salesInvoicecount, setInvoiceCount] = useState([]);
  const [showTotalSalesAmount, setTotalSalesAmount] = useState([]);

  const [userId, setUserId] = useState("");
  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id);
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin);
    }
    fetchEstimate();
  }, [auth, userId]);

  const fetchEstimate = async () => {
    try {
      const response = await axios.get(
        `/api/v1/salesInvoiceRoute/getAllsalesinvoice/${userId}`
      );

      setTotalSalesAmount(response.data.response);
      setInvoiceCount(response.data.response.length);
    } catch (error) {
      console.log("Error fetching sales estimates.", error);
    }
  };

  const totalNetAmount = showTotalSalesAmount?.reduce(
    (acc, item) => acc + parseFloat(item.netAmount || 0),
    0
  );
  // Sum all quantities from rows in each object
  const totalQuantity = showTotalSalesAmount?.reduce((acc, item) => {
    // Sum all quantities in the 'rows' array
    const rowsQuantity = item?.rows?.reduce((rowAcc, row) => rowAcc + row.qty, 0);
    return acc + rowsQuantity;
  }, 0);


  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <main className="responsive-container">
      <div className="  bg-gray-100 ">
        <div className="text-3xl mb-3 font-bold text-indigo-700 text-center">
          Dashboard
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4  gap-4">
          <div className="flex  flex-col  hover:scale-95 items-center rounded-md ">
            <div className="bg-purple-400 h-24 text-2xl gap-16 w-full flex gap-16 items-center justify-center rounded-md">
              <span>{totalNetAmount}</span>
              <FaChartBar size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Total Sales
            </div>
          </div>
          <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-purple-400 h-24 text-2xl gap-16 w-full  flex items-center justify-center rounded-md">
              <span>{salesInvoicecount}</span>
              <FaMoneyBill size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Total Invoices
            </div>
          </div>
          <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-purple-400 h-24 text-2xl gap-16 w-full flex items-center justify-center rounded-md">
              <span>{55}</span>
              <FaUsers size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Trade Receivables
            </div>
          </div>
          <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-purple-400 h-24 text-2xl gap-16 w-full flex items-center justify-center rounded-md">
              <span>{totalQuantity}</span>
              <FaShoppingCart size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Qty Sold
            </div>
          </div>
          <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-purple-400 h-24 text-2xl gap-16 w-full flex items-center justify-center rounded-md">
              <span>500</span>
              <FaBuilding size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Total Customers
            </div>
          </div>
          <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-green-400 h-24 text-2xl gap-16 w-full flex items-center justify-center rounded-md">
              <span>300</span>
              <FaMoneyCheckAlt size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Total Purchase
            </div>
          </div>
          {/* <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-green-400 h-24 text-2xl gap-16 w-full flex items-center justify-center rounded-md">
              <span>300</span>
              <FaClipboardList size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Total Bills
            </div>
          </div> */}
          <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-green-400 h-24 text-2xl gap-16 w-full flex items-center justify-center rounded-md">
              <span>550</span>
              <FaMoneyBillAlt size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Trade Payables
            </div>
          </div>
          <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-green-400 h-24 text-2xl gap-16 w-full flex items-center justify-center rounded-md">
              <span>400</span>
              <FaCubes size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Qty Purchase
            </div>
          </div>
          <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-green-400 h-24 text-2xl gap-16 w-full flex items-center justify-center rounded-md">
              <span>700</span>
              <FaUserFriends size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Total Supplier
            </div>
          </div>
          <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-pink-400 h-24 text-2xl gap-16 w-full flex items-center justify-center rounded-md">
              <span>400</span>
              <FaCashRegister size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Cash
            </div>
          </div>
          <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-pink-400 h-24 text-2xl gap-16 w-full flex items-center justify-center rounded-md">
              <span>6000</span>
              <FaPiggyBank size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Bank
            </div>
          </div>
          <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-pink-400 h-24 text-2xl gap-16 w-full flex items-center justify-center rounded-md">
              <span>800</span>
              <FaMoneyCheck size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Total Expense
            </div>
          </div>
          <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-pink-400 h-24 text-2xl gap-16 w-full flex items-center justify-center rounded-md">
              <span>900</span>
              <FaDollarSign size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Closing Units
            </div>
          </div>
          <div className="flex flex-col  hover:scale-95 items-center rounded-md">
            <div className="bg-pink-400 h-24 text-2xl gap-16 w-full flex items-center justify-center rounded-md">
              <span>300</span>
              <FaCalculator size={24} />
            </div>
            <div className="mt-2 text-center text-black text-xl h-10 w-full">
              Closing Stock
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
