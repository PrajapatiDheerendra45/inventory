import React, { useEffect } from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../pages/admin/Header";
import Home from "../pages/admin/Home";
import Test from "./Test";
import { useAuth } from "../context/Auth";
import SuperAdminSideBar from "../pages/SupeAdmin/SuperAdminSideBar.js";
import Logout from "../pages/admin/Logout.js";
import SubscriptionPlans from "../pages/SupeAdmin/SubsCription/SubscriptionPlans.js";
import AllUser from "../pages/SupeAdmin/AllUser.jsx";
import ActiveUser from "../pages/SupeAdmin/ActiveUser.jsx";
import InActiveUser from "../pages/SupeAdmin/InActiveUser.jsx";
import SubscribedUser from "../pages/SupeAdmin/SubscribedUser.jsx";
import Analytics from "../pages/SupeAdmin/Analytics.jsx";
import RevenueAnalytics from "../pages/SupeAdmin/RevenueAnalytics.jsx";
import UsersStaff from "../pages/SupeAdmin/UsersStaff.jsx";
import DemoContactList from "../pages/SupeAdmin/DemoContactList.js";
const SuperAdminRoute = () => {
  const [auth] = useAuth();

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <SuperAdminSideBar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <Routes>
        <Route path="/" element={<Home />} />
       

        <Route path="/*" element={<Test />} /> 
        <Route path="/subscriptionPlans" element={<SubscriptionPlans/>}/>
         <Route path ="/all-users"  element={<AllUser/>}/>
         <Route path ="/active-users"  element={<ActiveUser/>}/>
         <Route path ="/inactive-users" element={<InActiveUser/>}/>
         <Route path = "/subscribed-users" element={<SubscribedUser/>}/>
         <Route path = "/analytics" element={<Analytics/>}/>
         <Route path = "/revenue-analytics" element={<RevenueAnalytics/>}/>
         <Route path = "/users-staff" element = {<UsersStaff/>}/>
         <Route path = "/contactList" element={<DemoContactList/>}/>
        <Route path="log-out" element={<Logout/>} />

        
       

      </Routes>
    </div>
  );
};

export default SuperAdminRoute;
