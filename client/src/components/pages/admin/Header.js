import { React, useState } from "react";
import { BsJustify } from "react-icons/bs";
import "./Admin.css";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { Link } from "react-router-dom";

function Header({ OpenSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify
          className="icon"
          style={{ color: "white", fontSize: "24px" }}
          onClick={OpenSidebar}
        />
      </div>

      <div  className="header-left"></div>

      {/* <div className="header-right ml-1 flex  flex-wrap gap-5">
        <span
          className="cursor-pointer text-black  rounded-full  bg-gray-300 p-2  relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AiOutlineAppstoreAdd className="text-xl" />
          {isMenuOpen && (
            <div className="dropdown">
              <div className="dropdown-trigger text-nowrap absolute mt-2 p-2 right-0 bg-slate-200 text-stone-950 rounded shadow">
                <select className="dropdown-trigger text-nowrap relative p-2 right-0 bg-slate-200 text-stone-950 rounded border-none">
                  <option disabled>select</option>
                  <option>
                    <Link
                      to="#option1"
                      className="dropdown-trigger text-nowrap w-full p-3 right-0 bg-slate-200 text-stone-950 rounded shadow"
                    >
                      Create Company{" "}
                    </Link>
                  </option>
                  <option>
                    <Link
                      to="#option2"
                      className="dropdown-trigger text-nowrap w-full p-3 right-0 bg-slate-200 text-stone-950 rounded shadow"
                    >
                      Alter Company
                    </Link>
                  </option>{" "}
                  <option>
                    <Link
                      to="#option3"
                      className="dropdown-trigger text-nowrap w-full  p-3 right-0 bg-slate-200 text-stone-950 rounded shadow"
                    >
                      List Of Company
                    </Link>
                  </option>
                </select>
              </div>
            </div>
          )}
        </span>
        <img
          className="h-12 w-12 rounded-full"
          src="https://media.licdn.com/dms/image/D4D03AQEyruISxvTM2w/profile-displayphoto-shrink_100_100/0/1709382577654?e=1721865600&v=beta&t=3alzS-lxdzd05nWPo8e_fGu4cZbe8cx8sSXbCZIf-ck"
        />
        {/* <button onClick={toggleButton}>{isOn ? "On" : "Off"}</button> */}
      {/* </div> */}
    </header>
  );
}

export default Header;
