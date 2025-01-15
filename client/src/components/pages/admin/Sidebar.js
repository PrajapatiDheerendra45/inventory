import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { GoRepoTemplate } from "react-icons/go";
import { MdSubscriptions } from "react-icons/md"; // Material Icons
import {
  MdDashboard,
  MdInventory,
  MdPointOfSale,
  MdSettings,
  MdExitToApp,
  MdAccountBalance,
} from "react-icons/md";
import { FaUsers, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const [showParties, setParties] = useState(false);
  const [showTransport, setTransport] = useState(false);
  const [showCustomer, setCustomer] = useState(false);

  const [showManufacture, setManufacture] = useState(false);

  const [showStaff, setStaff] = useState(false);
  const [showVendor, setVendor] = useState(false);
  const [showspplier, setSupplier] = useState(false);

  const [showBankDropdown, setBank] = useState(false);
  const [showBankTransction, setBankTransaction] = useState(false);
  const [showInventory, setInventory] = useState(false);
  const [showInventoryCategory, setInventoryCategory] = useState(false);
  const [showInventorySubCategory, setInventorySubCategory] = useState(false);
  const [showInventoryBrand, setInventoryBrand] = useState(false);
  const [showInventorySubBrand, setInventorySubBrand] = useState(false);
  const [showInventoryStockUnit, setInventoryStockUnit] = useState(false);
  const [showInventoryBranch, setInventoryBranch] = useState(false);
  const [showInventoryProduct, setInventoryProduct] = useState(false);
  const [showPurches, setPurches] = useState(false);
  const [showSales, setSales] = useState(false);
  const [showIncome, setIncome] = useState(false);
  const [showCRM, setCRM] = useState(false);
  const [showReport, setReport] = useState(false);
  const [showSettings, setSettings] = useState(false);
  const [showBankTransaction, setShowBankTransction] = useState(false);
  const [showCash, setCash] = useState(false);
  const [showExpenses, setExpenses] = useState(false);
  const [showAccount, SetShowAccount] = useState(false);
  const [showSubscription, setSubscription] = useState(false);
  const [showReports, setReports] = useState(false);
  const sidebarRef = useRef(null);

  const closeAll = () => {
    setParties(false);
    setTransport(false);
    setCustomer(false);
    setManufacture(false);
    SetShowAccount(false);
    setShowBankTransction(false);

    setStaff(false);
    setVendor(false);
    setSupplier(false);
    setBank(false);
    setInventory(false);
    setInventoryCategory(false);
    setInventorySubCategory(false);
    setInventoryBrand(false);
    setInventoryStockUnit(false);
    setInventoryBranch(false);
    setInventoryProduct(false);
    setPurches(false);
    setSales(false);
    setCash(false);
    setIncome(false);
    setCRM(false);
    setReport(false);
    setSettings(false);
    setSubscription(false);
  };

  const togglePurches = () => {
    closeAll();
    setPurches(!showPurches);
  };

  const toggleParties = () => {
    closeAll();
    setParties(!showParties);
  };
  const toggleAccount = () => {
    closeAll();
    SetShowAccount(!showAccount);
  };

  const toggleBank = () => {
    closeAll();
    setBank(!showBankDropdown);
  };
  const toggleInventry = () => {
    closeAll();
    setInventory(!showInventory);
  };
  const toggleSales = () => {
    closeAll();
    setSales(!showSales);
  };

  const toggleCash = () => {
    closeAll();
    setCash(!showCash);
  };
  const toggleCRM = () => {
    closeAll();
    setCRM(!showCRM);
  };

  const toggleReport = () => {
    closeAll();
    setReport(!showReport);
  };
  const toggleReports = () => {
    closeAll();
    setReports(!showReports);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        openSidebarToggle
      ) {
        OpenSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSidebarToggle, OpenSidebar]);
  const toggleSettings = () => {
    closeAll();
    setSettings(!showSettings);
  };
  const toggleSubscription = () => {
    closeAll();
    setSubscription(!showSubscription);
  };
  const closeSidebar = () => {
    if (openSidebarToggle) {
      OpenSidebar();
    }
  };
  return (
    <aside
      ref={sidebarRef}
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive " : " p-2"}
    >
      <div className="sidebar-title">
        <div className="flex justify-between items-center gap-5">
          <div className="flex items-center">
            <Link to="/">
            <img
              src="https://manasvitech.in/assets/manasvilogo-DYhVbJnJ.png"
              alt="Company Logo"
              className="h-8"
            />
            </Link>
          
          </div>
        </div>
        <span
          // style={{ borderColor: "white" }}
          className="icon close_icon border text-white"
          onClick={OpenSidebar}
          style={{ color: "white", fontSize: "24px" }}
        >
          <IoMdClose />
        </span>
      </div>

      <ul className="sidebar-list">
        {/* Dashboard */}
        <li className="">
          <a href="../src/pages/Dharma.js" className="w-full">
            <Link
              to="/admin/admindash"
              className="w-full sidebar-list-item flex items-center innerlist justify-between focus:outline-none text-white "
            >
              <MdDashboard className="mr-2" /> <span>Admin Dashboard</span>
            </Link>
          </a>
        </li>

        {/* Parties */}
        <li className="px-0 py-2">
          <button
            onClick={() => {
              setParties(!showParties);
              toggleParties();
            }}
            className="w-full sidebar-list-item flex items-center innerlist justify-between focus:outline-none text-white p-1"
          >
            {" "}
            <span className="flex ">
              {" "}
              <FaUsers className="mr-2 mt-2" />
              Parties
            </span>
            {/* <span className="">Parties</span> */}
            {!showParties ? <IoIosArrowForward /> : <IoIosArrowDown />}
          </button>
          {showParties && (
            <ul className="ml-4">
              {/* Supplier */}
              <li className="">
                <button
                  onClick={() => setSupplier(!showspplier)}
                  className="w-full flex items-center nestedlist innerlist sidebar-list-item justify-between focus:outline-none text-white nesteditem"
                >
                  <span>Supplier</span>
                  {!showspplier ? <IoIosArrowForward /> : <IoIosArrowDown />}
                </button>
                {showspplier && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        to="/admin/CreateSupplier"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Add Supplier
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/ManageSupplier"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Supplier List
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              {/* Customer */}
              <li className="">
                <button
                  onClick={() => setCustomer(!showCustomer)}
                  className="w-full flex items-center nestedlist innerlist sidebar-list-item justify-between focus:outline-none text-white nesteditem"
                >
                  <span>Customer</span>
                  {!showCustomer ? <IoIosArrowForward /> : <IoIosArrowDown />}
                </button>
                {showCustomer && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        to="/admin/CreateCustomer"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Add Customer
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/ManageCustomer"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Customer List
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Manufacture */}

              <li className="">
                <button
                  onClick={() => setManufacture(!showManufacture)}
                  className="w-full flex items-center nestedlist innerlist sidebar-list-item justify-between focus:outline-none text-white nesteditem"
                >
                  <span>Manufacturer</span>
                  {!showManufacture ? (
                    <IoIosArrowForward />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </button>
                {showManufacture && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        to="/admin/CreateManufacturer"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Add Manufacturer
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/ManageManufacturer"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Manufacturer List
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Vendor */}
              <li className="">
                <button
                  onClick={() => setVendor(!showVendor)}
                  className="w-full flex items-center innerlist sidebar-list-item nestedlist justify-between focus:outline-none text-white nesteditem"
                >
                  <span>Vendor</span>
                  {!showVendor ? <IoIosArrowForward /> : <IoIosArrowDown />}
                </button>
                {showVendor && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        to="/admin/createvendors"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Create Vendor
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/manageVendor"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Manage Vendor
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Transport */}
              <li className="">
                <button
                  onClick={() => setTransport(!showTransport)}
                  className="w-full flex items-center innerlist sidebar-list-item justify-between focus:outline-none text-white nesteditem"
                >
                  <span>Transport</span>
                  {!showTransport ? <IoIosArrowForward /> : <IoIosArrowDown />}
                </button>
                {showTransport && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        to="/admin/createtranspoter"
                        className="flex items-center text-white nesteditem  p-1"
                      >
                        Create Transporter
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/managetranspoter"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Manage Transporter
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </li>

        {/* Inventory */}
        <li className="px-1 py-2 ">
          <button
            onClick={() => {
              setInventory(!showInventory);
              toggleInventry();
            }}
            className="w-full sidebar-list-item flex items-center innerlist justify-between focus:outline-none text-white "
          >
            <span className="flex ">
              {" "}
              <MdInventory className="mr-2 mt-2" />
              Inventory
            </span>
            {!showInventory ? <IoIosArrowForward /> : <IoIosArrowDown />}
          </button>
          {showInventory && (
            <ul className="ml-4   ">
              <li className=" ">
                <Link
                  to="/admin/addcategory"
                  className="flex items-center text-white nestitemhover"
                >
                  Create Category
                </Link>
                <li className=" ">
                  <Link
                    to="/admin/ManageCategory"
                    className="flex items-center text-white nestitemhover"
                  >
                    Manage Category
                  </Link>
                </li>
              </li>

              <li className=" ">
                <Link
                  to="/admin/addsubcategory"
                  className="flex items-center text-white nestitemhover"
                >
                  Create Sub Category
                </Link>
                <li className=" ">
                  <Link
                    to="/admin/managesubcategory"
                    className="flex items-center text-white nestitemhover"
                  >
                    Manage Sub Category
                  </Link>
                </li>
              </li>

              <li className=" ">
                <Link
                  to="/admin/addbrand"
                  className="flex items-center text-white nestitemhover"
                >
                  Create Brand
                </Link>

                <li className=" ">
                  <Link
                    to="/admin/manageBrand"
                    className="flex items-center text-white nestitemhover"
                  >
                    Manage Brand
                  </Link>
                </li>
              </li>

              <li className=" ">
                <Link
                  to="/admin/AddSubBrand"
                  className="flex items-center text-white nestitemhover"
                >
                  Add Sub Brand
                </Link>
                <li className=" ">
                  <Link
                    to="/admin/manageSubBrand"
                    className="flex items-center text-white nestitemhover"
                  >
                    Manage Sub Brand
                  </Link>
                </li>
              </li>

              <li className=" ">
                <Link
                  to="/admin/addstock"
                  className="flex items-center text-white nestitemhover"
                >
                  Create Unit
                </Link>
                <li className=" ">
                  <Link
                    to="/admin/managestockunit"
                    className="flex items-center text-white nestitemhover"
                  >
                    Manage Unit
                  </Link>
                </li>
              </li>

              <li className=" ">
                <Link
                  to="/admin/createproduct"
                  className="flex items-center text-white nestitemhover"
                >
                  Add Product
                </Link>
                <li className=" ">
                  <Link
                    to="/admin/manageproduct"
                    className="flex items-center text-white nestitemhover"
                  >
                    Manage Product
                  </Link>
                </li>
              </li>
            </ul>
          )}
        </li>

        {/* Sales */}
        <li className="px-1 py-2 ">
          <button
            onClick={() => {
              setSales(!showSales);
              toggleSales();
            }}
            className="w-full sidebar-list-item flex items-center innerlist justify-between focus:outline-none text-white p-1"
          >
            <span className="flex">
              {" "}
              <MdPointOfSale className="mr-2 mt-2" />
              Sales
            </span>
            {!showSales ? <IoIosArrowForward /> : <IoIosArrowDown />}
          </button>
          {showSales && (
            <ul className="ml-4">
              <li>
                <Link
                  to="/admin/CreateSalesEstimate"
                  className="flex items-center text-white nestitemhover "
                >
                  Create Sales Estimate
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/ManageSalesEstimate"
                  className="flex items-center text-white nestitemhover "
                >
                  Sales Estimate List
                </Link>
              </li>
              <li className="">
                <Link
                  to="/admin/invoice"
                  className="flex items-center text-white nestitemhover"
                >
                  create Sales Invoice
                </Link>
              </li>

              <li className="">
                <Link
                  to="/admin/ManageSalesInvoice"
                  className="flex items-center text-white nestitemhover"
                >
                  Sales Invoice List
                </Link>
              </li>

              <li className="">
                <Link
                  to="/admin/deliverychallan"
                  className="flex items-center text-white nestitemhover"
                >
                  create Delivery challan
                </Link>
              </li>
              <li className="">
                <Link
                  to="/admin/manageDeliveryChallan"
                  className="flex items-center text-white nestitemhover"
                >
                  Delivery Challan List
                </Link>
              </li>

              <li className="">
                <Link
                  to="/admin/salesreturn"
                  className="flex items-center text-white nestitemhover"
                >
                  Create Sales Return
                </Link>
              </li>

              <li className="">
                <Link
                  to="/admin/manageSalesReturn"
                  className="flex items-center text-white nestitemhover"
                >
                  Manage Sales Return
                </Link>
              </li>

              <li className="">
                <Link
                  to="/admin/pos"
                  className="flex items-center text-white nestitemhover"
                >
                  Point of Sales
                </Link>
              </li>

              <li className="">
                <Link
                  to="/admin/onlinestore"
                  className="flex items-center text-white nestitemhover"
                >
                  Online Store
                </Link>
              </li>

              <li className="">
                <Link
                  to="/admin/payin"
                  className="flex items-center text-white nestitemhover"
                >
                  Pay In
                </Link>
              </li>

              <li className="">
                <Link
                  to="/admin/ManagePayIn"
                  className="flex items-center text-white nestitemhover"
                >
                  Manage Pay In
                </Link>
              </li>

              <li className="">
                <Link
                  to="/admin/TotalSalesList"
                  className="flex items-center text-white nestitemhover"
                >
                  Total Sales List
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Purches */}
        <li className="px-1 py-2 ">
          <button
            onClick={() => {
              setPurches(!showPurches);
              togglePurches();
            }}
            className="w-full sidebar-list-item flex items-center innerlist justify-between focus:outline-none text-white   p-1"
          >
            <span className="flex ">
              {" "}
              <FaShoppingCart className="mr-2 mt-2" />
              Purchase
            </span>
            {!showPurches ? <IoIosArrowForward /> : <IoIosArrowDown />}
          </button>
          {showPurches && (
            <ul className="ml-4">
              <li className=" ">
                <Link
                  to="/admin/CreatePurchaseOrder"
                  className="flex items-center text-white nestitemhover "
                >
                  Create Purchase Order
                </Link>
              </li>
              <li className="">
                <Link
                  to="/admin/ManagePurchaseOrder"
                  className="flex items-center text-white nestitemhover"
                >
                  Purchase Order List
                </Link>
              </li>
              <li className="">
                <Link
                  to="/admin/purchesInvoice"
                  className="flex items-center text-white nestitemhover"
                >
                  Purchase Invoice
                </Link>
              </li>
              <li className="">
                <Link
                  to="/admin/ManagePurchaseInvoice"
                  className="flex items-center text-white nestitemhover"
                >
                  Purchase Invoice List
                </Link>
              </li>
              <li className="">
                <Link
                  to="/admin/purchasereturn"
                  className="flex items-center text-white nestitemhover"
                >
                  Purchase Return
                </Link>
              </li>
              <li className="">
                <Link
                  to="/admin/managepurchasereturn"
                  className="flex items-center text-white nestitemhover"
                >
                  Purchase Return List
                </Link>
              </li>{" "}
              <li className="">
                <Link
                  to="/admin/PayOut"
                  className="flex items-center text-white nestitemhover"
                >
                  Pay Out
                </Link>
              </li>{" "}
              <li className="">
                <Link
                  to="/admin/ManagePayOut"
                  className="flex items-center text-white nestitemhover"
                >
                  Manage Pay out
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* cash */}
        <li className="px-1 py-2 ">
          <button
            onClick={() => {
              setCash(!showCash);
              toggleCash();
            }}
            className="w-full sidebar-list-item flex items-center innerlist justify-between focus:outline-none text-white   p-1"
          >
            <span className="flex">
              {" "}
              <FaMoneyBillWave className="mr-2 mt-2" />
              cash
            </span>
            {!showCash ? <IoIosArrowForward /> : <IoIosArrowDown />}
          </button>
          {showCash && (
            <ul className="ml-4   ">
              <li className=" ">
                <Link
                  to="/admin/cash"
                  className="flex items-center text-white nestitemhover "
                >
                  Manage cash
                </Link>
              </li>
              {/* <li className="">
                <Link
                  to="/admin/dashboard/manageperformance"
                  className="flex items-center text-white nestitemhover"
                >
                  Manage Cash
                </Link>
              </li> 
              <li className="">
                <Link
                  to="/admin/dashboard/manageperformance"
                  className="flex items-center text-white nestitemhover"
                >
                  Add Bank
                </Link>
              </li>{" "} */}
              <li className="">
                <Link
                  to="/admin/addbank"
                  className="flex items-center text-white nestitemhover"
                >
                  Manage Bank
                </Link>
              </li>
            </ul>
          )}
        </li>
        {/* Account */}
        <li className="px-0 py-2">
          <button
            onClick={() => {
              setBankTransaction(!showAccount);
              toggleAccount();
            }}
            className="w-full sidebar-list-item flex items-center innerlist sidebar-list-item justify-between focus:outline-none text-white p-1"
          >
            <span className="flex">
              {" "}
              <MdAccountBalance className="mr-2 mt-2" />
              Account
            </span>
            {!showAccount ? <IoIosArrowForward /> : <IoIosArrowDown />}
          </button>
          {showAccount && (
            <ul className="ml-4">
              {/* setBankTransaction */}
              <li className="">
                <button
                  onClick={() => setShowBankTransction(!showBankTransaction)}
                  className="w-full flex items-center  innerlist sidebar-list-item justify-between focus:outline-none text-white nesteditem"
                >
                  <span className="text-nowrap">Bank Transaction</span>
                  {!showBankTransaction ? (
                    <IoIosArrowForward />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </button>
                {showBankTransaction && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        to="/admin/bankTobankTransfer"
                        className="flex items-center  text-white nesteditem p-1"
                      >
                        Bank to Bank Transfer
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/managebanktobanktransfer"
                        className="flex items-center  text-white nesteditem p-1"
                      >
                        Manage Bank to Bank Transfer
                      </Link>
                    </li>

                    
                    <li>
                      <Link
                        to="/admin/CashDepositIntoBank"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Cash Deposit Into Bank
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/admin/managecashdepositeintobank"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Manage Cash Deposit Into Bank
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/admin/cashwithdrawfrombank"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Cash Withdraw from Bank
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/admin/managecashwithdrawfrombank"
                        className="flex items-center text-white nesteditem p-1"
                      >
                       manage Cash Withdraw from Bank
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="">
                <button
                  onClick={() => setExpenses(!showExpenses)}
                  className="w-full flex items-center nestedlist innerlist sidebar-list-item justify-between focus:outline-none text-white nesteditem"
                >
                  <span>Expenses</span>
                  {!showExpenses ? <IoIosArrowForward /> : <IoIosArrowDown />}
                </button>
                {showExpenses && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        to="/admin/AddExpense"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Add Expenses
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/ManageExpense"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Expenses List
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* income*/}
              <li className="">
                <button
                  onClick={() => setIncome(!showIncome)}
                  className="w-full flex items-center innerlist sidebar-list-item nestedlist justify-between focus:outline-none text-white nesteditem"
                >
                  <span>Income</span>
                  {!showIncome ? <IoIosArrowForward /> : <IoIosArrowDown />}
                </button>
                {showIncome && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        to="/admin/AddIncome"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Add Income
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/ManageIncome"
                        className="flex items-center text-white nesteditem p-1"
                      >
                        Manage Income
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </li>

        {/* Settings */}
        <li className="px-1 py-2 ">
          <button
            onClick={() => {
              setSettings(!showSettings);
              toggleSettings();
            }}
            className="w-full sidebar-list-item flex items-center innerlist justify-between focus:outline-none text-white   p-1"
          >
            <span className="flex">
              {" "}
              <MdSettings className="mr-2 mt-2" />
              Settings
            </span>
            {!showSettings ? <IoIosArrowForward /> : <IoIosArrowDown />}
          </button>
          {showSettings && (
            <ul className="ml-4   ">
              <li className=" ">
                <Link
                  to="/admin/updateCompanyRegistration"
                  className="flex items-center text-white nestitemhover "
                >
                  Company Setup Update
                </Link>
              </li>
              <li className="">
                <Link
                  to="/admin/createstaff"
                  className="flex items-center text-white nestitemhover"
                >
                  Add Staff
                </Link>
              </li>
              <li className="">
                <Link
                  to="/admin/manage-staff"
                  className="flex items-center text-white nestitemhover"
                >
                  Manage Staff
                </Link>
              </li>
              <li className="">
                <Link
                  to="/admin/profileupdate"
                  className="flex items-center text-white nestitemhover"
                >
                  Change Profile
                </Link>
              </li>
              <li className="">
                <Link
                  to="/admin/dashboard/manageperformance"
                  className="flex items-center text-white nestitemhover"
                >
                  Account Settings
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* subscription */}

        <li className="px-1 py-2 ">
          <button
            onClick={() => {
              setSubscription(!showSubscription);
              toggleSubscription();
            }}
            className="w-full sidebar-list-item flex items-center innerlist justify-between focus:outline-none text-white   p-1"
          >
            <span className="flex">
              <MdSubscriptions className="mr-2 mt-2" />
              Subscription
            </span>
            {!showSubscription ? <IoIosArrowForward /> : <IoIosArrowDown />}
          </button>
          {showSubscription && (
            <ul className="ml-4   ">
              <li className="nestedlist innerlist sidebar-list-item ">
                <Link
                  to="/admin/current-plan"
                  className="flex items-center text-white nestitemhover "
                >
                  Current Plan
                </Link>
              </li>
              <li className="nestedlist innerlist sidebar-list-item">
                <Link
                  to="/admin/plan-history"
                  className="flex items-center text-white nestitemhover"
                >
                  history
                </Link>
              </li>
            </ul>
          )}
        </li>
        {/* Reports */}
        <li className="px-1 py-2 ">
          <button
            onClick={() => {
              setReports(!showReports);
              toggleReports();
            }}
            className="w-full sidebar-list-item flex items-center innerlist justify-between focus:outline-none text-white   p-1"
          >
            <span className="flex">
              <GoRepoTemplate className="mr-2 mt-2" />
              Reports
            </span>
            {!showReports ? <IoIosArrowForward /> : <IoIosArrowDown />}
          </button>
          {showReports && (
            <ul className="ml-4   ">
              <li className="nestedlist innerlist sidebar-list-item ">
                <Link
                  to="/admin/stockreports"
                  className="flex items-center text-white nestitemhover "
                >
                  Stock Reports
                </Link>
              </li>
              <li className="nestedlist innerlist sidebar-list-item ">
                <Link
                  to="/admin/salesreports"
                  className="flex items-center text-white nestitemhover "
                >
                  Sales Reports
                </Link>
              </li>
              <li className="nestedlist text-nowrap innerlist sidebar-list-item">
                <Link
                  to="/admin/purchesreports"
                  className="flex items-center text-white nestitemhover"
                >
                  Purches Reports
                </Link>
              </li>
              <li className="nestedlist innerlist sidebar-list-item">
                <Link
                  to="/admin/DayBook"
                  className="flex items-center text-white nestitemhover"
                >
                  Day Book
                </Link>
              </li>
              <li className="nestedlist innerlist sidebar-list-item">
                <Link
                  to="/admin/cashBook"
                  className="flex items-center text-white nestitemhover"
                >
                  Cash Book
                </Link>
              </li>
              <li className="nestedlist innerlist sidebar-list-item">
                <Link
                  to="/admin/bankBook"
                  className="flex items-center text-white nestitemhover"
                >
                  Bank Book
                </Link>
              </li>
            </ul>
          )}
        </li>
        {/* Logout */}
        <li
          className="w-full sidebar-list-item flex items-center innerlist justify-between focus:outline-none text-white   "
          onClick={closeSidebar}
        >
          <Link to="/admin/log-out" class="">
            <span className="flex">
              {" "}
              <MdExitToApp className="mr-2 mt-2" />
              Log Out
            </span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
