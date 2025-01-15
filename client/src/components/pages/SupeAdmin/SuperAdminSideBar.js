import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowForward, IoMdClose } from "react-icons/io";
import { MdDashboard, MdSubscriptions, MdPeople, MdPerson, MdExitToApp, MdCheckCircle, MdHighlightOff } from "react-icons/md";
import Analytics from './Analytics';
import { IoHome } from "react-icons/io5";
function SuperAdminSideBar({ openSidebarToggle, OpenSidebar }) {
  const [showParties, setParties] = useState(false);
  const [showTransport, setTransport] = useState(false);
  const [showCustomer, setCustomer] = useState(false);

  const sidebarRef = useRef(null);

  const closeAll = () => {
    setParties(false);
    setTransport(false);
    setCustomer(false);
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

  const closeSidebar = () => {
    if (openSidebarToggle) {
      OpenSidebar();
    }
  };

  return (
    <aside
      ref={sidebarRef}
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive " : "  "}
    >
      <div className="sidebar-title">
        <div className="flex  items-center gap-5">
          <div className="flex items-center">
            <img
              src="https://manasvitech.in/assets/manasvilogo-DYhVbJnJ.png"
              alt="Company Logo"
              className="h-8"
            />
          </div>
        </div>
        <span
          style={{ borderColor: "white" }}
          className="icon close_icon border text-white"
          onClick={OpenSidebar}
        >
          <IoMdClose />
        </span>
      </div>

      <ul className="sidebar-list ">
        {/* Dashboard */}
        <Link 
          to="/"
          className="w-full sidebar-list-item flex items-center w-full flex items-center nestedlist innerlistsuperadmin sidebar-list-item  focus:outline-none text-white nesteditemsuperadmin  focus:outline-none text-white"
        >
          <li className="flex items-center">
            <IoHome className="mr-2" />
            <span className="text-nowrap">Home</span>
          </li>
        </Link>
        <Link
          to="/superadmin/"
          className="w-full sidebar-list-item flex items-center w-full flex items-center nestedlist innerlistsuperadmin sidebar-list-item  focus:outline-none text-white nesteditemsuperadmin  focus:outline-none text-white"
        >
          <li className="flex items-center">
            <MdDashboard className="mr-2" />
            <span className="text-nowrap">Dashboard</span>
          </li>
        </Link>
        <Link to="/superadmin/subscriptionPlans" className="w-full">
          <li
            className="w-full sidebar-list-item flex items-center w-full flex items-center nestedlist innerlistsuperadmin sidebar-list-item  focus:outline-none text-white nesteditemsuperadmin  focus:outline-none text-white"
            onClick={closeSidebar}
          >
            <MdSubscriptions className="mr-2" />
            <span>Subscription Plans</span>
          </li>
        </Link>
        <Link to="/superadmin/contactList" className="w-full">
          <li
            className="w-full sidebar-list-item flex items-center w-full flex items-center nestedlist innerlistsuperadmin sidebar-list-item  focus:outline-none text-white nesteditemsuperadmin  focus:outline-none text-white"
            onClick={closeSidebar}
          >
            <MdPeople className="mr-2" />
            <span>Contact List</span>
          </li>
        </Link>
        <Link to="/superadmin/all-users" className="w-full">
          <li
            className="w-full sidebar-list-item flex items-center w-full flex items-center nestedlist innerlistsuperadmin sidebar-list-item  focus:outline-none text-white nesteditemsuperadmin  focus:outline-none text-white"
            onClick={closeSidebar}
          >
            <MdPeople className="mr-2" />
            <span>Users</span>
          </li>
        </Link>
        <Link to="/superadmin/subscribed-users" className="w-full">
          <li
            className="w-full sidebar-list-item flex items-center w-full flex items-center nestedlist innerlistsuperadmin sidebar-list-item  focus:outline-none text-white nesteditemsuperadmin  focus:outline-none text-white"
            onClick={closeSidebar}
          >
            <MdPerson className="mr-2" />
            <span>Subscribed Users</span>
          </li>
        </Link>
        <Link to="/superadmin/active-users" className="w-full">
          <li
            className="w-full sidebar-list-item flex items-center w-full flex items-center nestedlist innerlistsuperadmin sidebar-list-item  focus:outline-none text-white nesteditemsuperadmin  focus:outline-none text-white"
            onClick={closeSidebar}
          >
            <MdCheckCircle className="mr-2" />
            <span>Active Users</span>
          </li>
        </Link>
        <Link to="/superadmin/inactive-users" className="w-full">
          <li
            className="w-full sidebar-list-item flex items-center w-full flex items-center nestedlist innerlistsuperadmin sidebar-list-item  focus:outline-none text-white nesteditemsuperadmin  focus:outline-none text-white"
            onClick={closeSidebar}
          >
            <MdHighlightOff className="mr-2" />
            <span>Inactive Users</span>
          </li>
        </Link>
        <Link to="/superadmin/users-staff" className="w-full">
          <li
            className="w-full sidebar-list-item flex items-center w-full flex items-center nestedlist innerlistsuperadmin sidebar-list-item  focus:outline-none text-white nesteditemsuperadmin  focus:outline-none text-white"
            onClick={closeSidebar}
          >
            <MdPeople className="mr-2" />
            <span>Users Staff</span>
          </li>
        </Link>

        <Link to="/superadmin/analytics" className="w-full">
          <li
            className="w-full sidebar-list-item flex items-center w-full flex items-center nestedlist innerlistsuperadmin sidebar-list-item  focus:outline-none text-white nesteditemsuperadmin  focus:outline-none text-white"
            onClick={closeSidebar}
          >
            <MdPeople className="mr-2" />
            <span> User Analytics</span>
          </li>
        </Link>
        <Link to="/superadmin/revenue-analytics" className="w-full">
          <li
            className="w-full sidebar-list-item flex items-center w-full flex items-center nestedlist innerlistsuperadmin sidebar-list-item  focus:outline-none text-white nesteditemsuperadmin  focus:outline-none text-white"
            onClick={closeSidebar}
          >
            <MdPeople className="mr-2" />
            <span> Revenue Analytics</span>
          </li>
        </Link>
        <Link to="/superadmin/log-out"  className="w-full">
          <li
            className="w-full sidebar-list-item flex items-center w-full flex items-center nestedlist innerlistsuperadmin sidebar-list-item  focus:outline-none text-white nesteditemsuperadmin  focus:outline-none text-white"
            onClick={closeSidebar}
          >
            <MdExitToApp className="mr-2" />
            <span>Log Out</span>
          </li>
        </Link>
      </ul>
    </aside>
  );
}

export default SuperAdminSideBar;
