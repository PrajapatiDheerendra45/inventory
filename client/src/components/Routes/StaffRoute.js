import React, { useEffect } from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../pages/admin/Header";
import Home from "../pages/admin/Home";

import Test from "./Test";
import { useAuth } from "../context/Auth";
import CreateSupplier from "../pages/admin/parties/CreateSupplier.js";
import ManageSupplier from "../pages/admin/parties/ManageSupplier.js";
import CreateTranspoter from "../pages/admin/parties/CreateTransporter.js";
import ManageTranspoter from "../pages/admin/parties/ManageTransporter.js";
import CreateCustomer from "../pages/admin/parties/CreateCustomer.js";
import ManageDeliveryChallan from "../pages/admin/sales/ManageDeliveryChallan.js";
import ManageCustomer from "../pages/admin/parties/ManageCustomer.js";
import Cash from "../pages/admin/cash/Cash.js";
import ManagePurchaseReturn from "../pages/admin/purchase/ManagePurchaseReturn.js";
import CreateVendors from "../pages/admin/parties/CreateVendors.js";
import ManageVendor from "../pages/admin/parties/ManageVendor.js";
import ManagePurchaseOrder from "../pages/admin/purchase/ManagePurchaseOrder.js";
import CreateStaff from "../pages/admin/settings/CreateStaff.js";
import BankToBankTranfer from "../pages/admin/accounts/banktransaction/BankToBankTransfer.js";
import AddBank from "../pages/admin/cash/AddBank.js";
import AddCategory from "../pages/admin/inventory/AddCategory.js";
import AddSubCategory from "../pages/admin/inventory/AddSubCategory.js";
import AddBrand from "../pages/admin/inventory/AddBrand.js";
import StockUnit from "../pages/admin/inventory/StockUnit.js";
import CashWithDrawFromBank from "../pages/admin/accounts/banktransaction/CashWithDrawFromBank.js";
import CashDepositIntoBank from "../pages/admin/accounts/banktransaction/CashDepositIntoBank.js";
import StockDetails from "../pages/admin/inventory/StockDetails.js";
import AddSubBrand from "../pages/admin/inventory/AddSubBrand.js";
import ManageCategory from "../pages/admin/inventory/ManageCategory.js";
import ManageSubCategory from "../pages/admin/inventory/ManageSubCategory.js";
import ManageStockUnit from "../pages/admin/inventory/ManageStockUnit.js";
import ManageBrand from "../pages/admin/inventory/ManageBrand.js";
import ManageSubBrand from "../pages/admin/inventory/ManageSubBrand.js";
import CreateBranches from "../pages/admin/CreateBranches.js";
import ManageBranches from "../pages/admin/ManageBranches.js";
import ManageSalesInvoice from "../pages/admin/sales/ManageSalesInvoice.js";
import CreateProduct from "../pages/admin/inventory/CreateProduct.js";
import CreateManufacturer from "../pages/admin/parties/CreateManufacturer.js";
import ManageManufacturer from "../pages/admin/parties/ManageManufacturer.js";
import Manageproducts from "../pages/admin/inventory/Manageproducts.js";
import CreateSalesEstimate from "../pages/admin/sales/CreateSalesEstimate.js";
import ManageSalesEstimate from "../pages/admin/sales/ManageSalesEstimate.js";
import CreateSalesInvoice from "../pages/admin/sales/CreateSalesInvoice.js";
import CreateDeliveryChallan from "../pages/admin/sales/CreateDeliveryChallan.js";
import CreateSalesReturn from "../pages/admin/sales/CreateSalesReturn.js";
import ManageSalesReturn from "../pages/admin/sales/ManageSalesReturn.js";
import AddExpense from "../pages/admin/accounts/expenses/AddExpense.js";
import ManageExpense from "../pages/admin/accounts/expenses/ManageExpense.js";
import AddIncome from "../pages/admin/accounts/income/AddIncome.js";
import ManageIncome from "../pages/admin/accounts/income/ManageIncome.js";
import Pos from "../pages/admin/sales/Pos.js";
import PayIn from "../pages/admin/sales/PayIn.js";
import ManagePayIn from "../pages/admin/sales/ManagePayIn.js";
import TotalSalesList from "../pages/admin/sales/TotalSalesList.js";
import PurchesReturn from "../pages/admin/purchase/PurchesReturn.js";
import CompanyRegistration from "../auth/CompanyRegistration.js";
import PurchesInvoice from "../pages/admin/purchase/PurchesInvoice.js";
import CreatePurchaseOrder from "../pages/admin/purchase/CreatePurchaseOrder.js";
import PayOut from "../pages/admin/purchase/PayOut.js";
import ManagePayOut from "../pages/admin/purchase/ManagePayOut.js";
import Logout from "../pages/admin/Logout.js";
import ProfileUpdate from "../auth/ProfileUpdate.js";
import CurrentPlan from "../pages/admin/subscription/CurrentPlan.jsx"
import PlanHistory from "../pages/admin/subscription/PlanHistory.jsx"
import ViewStaff from "../pages/admin/settings/ViewStaff.jsx";
import StaffSidebar from './../pages/staff/StaffSidebar';
import ManagePurchaseInvoice from "../pages/admin/purchase/ManagePurchaseInvoice.js";
import OnlineStore from "../pages/admin/sales/OnlineStore.js";
const StaffRoute = () => {
  const [auth] = useAuth();

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <StaffSidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/dash" element={<Home />} /> */}

        <Route path="/*" element={<Test />} />
        {/* rahul routing */}
        <Route path="/companyregistration" element={<CompanyRegistration />} />
        <Route path="/CreateSupplier" element={<CreateSupplier />} />
        <Route path="/ManageSupplier" element={<ManageSupplier />} />
        <Route path="CreateCustomer" element={<CreateCustomer />} />
        <Route path="ManageCustomer" element={<ManageCustomer />} />
        <Route path="/CreateManufacturer" element={<CreateManufacturer />} />
        <Route path="/ManageManufacturer" element={<ManageManufacturer />} />

        <Route path="Cash" element={<Cash />} />
        <Route path="bankTobankTransfer" element={<BankToBankTranfer />} />
        <Route path="cashwithdrawfrombank" element={<CashWithDrawFromBank />} />
        <Route path="CashDepositIntoBank" element={<CashDepositIntoBank />} />

        <Route path="addcategory" element={<AddCategory />} />
        <Route path="addsubcategory" element={<AddSubCategory />} />
        <Route path="addbrand" element={<AddBrand />} />
        <Route path="addstock" element={<StockUnit />} />
        <Route
          path="manageDeliveryChallan"
          element={<ManageDeliveryChallan />}
        />
        <Route path="onlinestore" element={<OnlineStore />} />
         <Route path="manageSalesReturn" element={<ManageSalesReturn />} />
        <Route path="AddSubBrand" element={<AddSubBrand />} />
        <Route path="ManageCategory" element={<ManageCategory />} />
        <Route path="managesubcategory" element={<ManageSubCategory />} />
        <Route path="createbranch" element={<CreateBranches />} />
        <Route path="managebranches" element={<ManageBranches />} />
        <Route path="ManageSalesInvoice" element={<ManageSalesInvoice />} />
        <Route path="createproduct" element={<CreateProduct />} />
        <Route path="managepurchasereturn" element={<ManagePurchaseReturn />} />
        {/* dheerendra routing */}
        <Route path="createtranspoter" element={<CreateTranspoter />} />
        <Route path="managetranspoter" element={<ManageTranspoter />} />
        <Route path="createvendors" element={<CreateVendors />} />
        <Route path="manageVendor" element={<ManageVendor />} />
        <Route path="ManagePurchaseInvoice" element={<ManagePurchaseInvoice />} />
       
        <Route path="createstaff" element={<CreateStaff />} />
        <Route path ="manage-staff" element={<ViewStaff/>}/>
        <Route path="addbank" element={<AddBank />} />
        <Route path="purchesInvoice" element={<PurchesInvoice />} />

        <Route path="stockdetails" element={<StockDetails />} />
        <Route path="managestockunit" element={<ManageStockUnit />} />
        <Route path="manageBrand" element={<ManageBrand />} />
        <Route path="manageSubBrand" element={<ManageSubBrand />} />

        {/* <Route path="invoice" element={<Invoice />} /> */}
        <Route path="invoice" element={<CreateSalesInvoice />} />
        <Route path="pos" element={<Pos />} />
        <Route path="payin" element={<PayIn />} />
        <Route path="ManagePayIn" element={<ManagePayIn />} />
        <Route path="TotalSalesList" element={<TotalSalesList />} />

        <Route path="purchasereturn" element={<PurchesReturn />} />

        {/* <Route path="deliverychallan" element={<DeliveryChallan />} /> */}
        <Route path="deliverychallan" element={<CreateDeliveryChallan />} />
        <Route path="salesreturn" element={<CreateSalesReturn />} />

        <Route path="ManageProduct" element={<Manageproducts />} />
        <Route path="CreateSalesEstimate" element={<CreateSalesEstimate />} />
        <Route path="ManageSalesEstimate" element={<ManageSalesEstimate />} />
        <Route path="AddExpense" element={<AddExpense />} />
        <Route path="ManageExpense" element={<ManageExpense />} />
        <Route path="AddIncome" element={<AddIncome />} />
        <Route path="ManageIncome" element={<ManageIncome />} />
        <Route path="CreatePurchaseOrder" element={<CreatePurchaseOrder />} />
        <Route path="PayOut" element={<PayOut />} />
        <Route path="ManagePayOut" element={<ManagePayOut />} />
        <Route path="profileupdate" element={<ProfileUpdate />} />
        <Route path="ManagePurchaseOrder" element={<ManagePurchaseOrder />} />
        
        <Route path="current-plan" element={<CurrentPlan/>}/>
        <Route path ="plan-history" element={<PlanHistory/>}/>
        <Route path="log-out" element={<Logout />} />
      </Routes>
    </div>
  );
};

export default StaffRoute;
