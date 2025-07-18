import React, { useState, useEffect, useRef } from "react";

import logo from "../Assests/trac_.png";
import userIcon from "../Assests/icons8-user-50.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/MockAuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { user, logout, isAuthenticated } = useAuth();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setDropdownOpen(false); 
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };
  return (
    <>
      <div className="relative z-1 w-[100%] bg-[#5fd6f4] flex justify-between items-center p-3 text-md h-[15vh]">
        <div className="h-[65px] order-1">
          <Link
            to={"/"}
            className={`cursor-pointer ${
              active === "Home" &&
              "text-red-600 font-bold border-b border-red-600"
            }`}
            onClick={() => {
              setOpen(false);
              setActive("Home");
            }}
          >
            <img
              src={logo}
              alt="Logo_Scrubs"
              className="h-[80%] md:ml-3 md:mt-1 filter drop-shadow-white-lg hover:scale-110"
            />
          </Link>
        </div>
        <div className="order-3 flex items-center">
          <ul
            className={`md:flex md:space-x-8 font-bold text-md ${
              open
                ? "absolute flex top-20 flex-col w-[100%] right-0 space-y-6 bg-gray-900 text-white p-10"
                : "hidden"
            }`}
          >
            <Link
              to={"/"}
              className={`cursor-pointer ${
                active === "Home" && "text-red-600 border-b border-red-600"
              }`}
              onClick={() => {
                setOpen(false);
                setActive("Home");
              }}
            >
              Home
            </Link>
            <a
              href="/#about"
              className={`cursor-pointer font-bold ${
                active === "About" &&
                "text-red-600 font-bold border-b border-red-600"
              }`}
              onClick={() => {
                setOpen(false);
                setActive("About");
              }}
            >
              About
            </a>
            <a
              href="/#contact"
              className={`cursor-pointer font-bold ${
                active === "Contact" &&
                "text-red-600 font-bold border-b border-red-600"
              }`}
              onClick={() => {
                setOpen(false);
                setActive("Contact");
              }}
            >
              Contact
            </a>
            <Link
              to={"/courses"}
              className={`cursor-pointer font-bold ${
                active === "Courses" &&
                "text-red-600 font-bold border-b border-red-600"
              }`}
              onClick={() => {
                setOpen(false);
                setActive("Courses");
              }}
            >
              Browse Courses
            </Link>
            <Link
              to={"/dashboard"}
              className={`cursor-pointer font-bold ${
                active === "Dashboard" &&
                "text-red-600 font-bold border-b border-red-600"
              }`}
              onClick={() => {
                setOpen(false);
                setActive("Dashboard");
              }}
            >
              Dashboard
            </Link>
            <Link
              to={"/course"}
              className={`cursor-pointer font-bold ${
                active === "Men" &&
                "text-red-600 font-bold border-b border-red-600"
              }`}
              onClick={() => {
                setOpen(false);
                setActive("Men");
              }}
            >
              Old Courses
            </Link>
            <Link
              to={"/pricing"}
              className={`cursor-pointer font-bold ${
                active === "pricing" &&
                "text-red-600 font-bold border-b border-red-600"
              }`}
              onClick={() => {
                setOpen(false);
                setActive("pricing");
              }}
            >
              Subscription
            </Link>
            <Link
              to={"/workshops"}
              className={`cursor-pointer font-bold ${
                active === "workshops" &&
                "text-red-600 font-bold border-b border-red-600"
              }`}
              onClick={() => {
                setOpen(false);
                setActive("workshops");
              }}
            >
              Workshops
            </Link>
          </ul>
          {isAuthenticated ? (
            // Show user dropdown when logged in
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2 hidden md:block">
                Welcome, {user?.name}
              </span>
              <div
                className="flex items-center justify-center py-1.5 bg-green-600 px-2 rounded-full font-semibold hover:text-white md:ml-6 hover:scale-110 w-10 h-10 cursor-pointer"
                onClick={() => navigate("/userprofile")}
              >
                <img
                  src={userIcon}
                  alt="Profile"
                  className="object-contain"
                  style={{
                    width: "5rem",
                    height: "1.6rem",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          ) : (
            // Show login button when not logged in
            <Link to="/login">
              <div
                className="flex items-center justify-center py-1.5 bg-blue-600 px-2 rounded-full font-semibold hover:text-white md:ml-6 hover:scale-110 w-10 h-10"
                style={{ backgroundColor: "#1676BC" }}
              >
                <img
                  onClick={() => navigate("/login")}
                  src={userIcon}
                  alt="Login"
                  className="object-contain"
                  style={{
                    width: "5rem",
                    height: "1.6rem",
                    pointerEvents: "none",
                    cursor: "pointer",
                  }}
                />
              </div>
            </Link>
          )}
          <div className="relative" ref={dropdownRef}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer"
              width="24"
              color="navyblue"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6 10l6 6l6 -6h-12" />
            </svg>
            {dropdownOpen && isAuthenticated && (
              <div className="absolute right-0 mt-2 w-48 z-50 bg-white shadow-lg rounded-md py-2">
                <button
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
                  onClick={() => handleNavigation("/userprofile-editprofile")}
                >
                  Edit Profile
                </button>
                <button
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
                  onClick={() => handleNavigation("/userprofile-membership")}
                >
                  Membership
                </button>
                <button
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
                  onClick={() => handleNavigation("/userprofile-purchase")}
                >
                  Purchase History
                </button>
                <button
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
                  onClick={() => handleNavigation("/userprofile-courses")}
                >
                  My Courses
                </button>
                <button
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
                  onClick={() =>
                    handleNavigation("/userprofile-editcreditcard")
                  }
                >
                  Edit Credit Card Info
                </button>
                <button
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
                  onClick={() => handleNavigation("/userprofile-address")}
                >
                  Address
                </button>
                <button
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
                  onClick={() =>
                    handleNavigation("/userprofile-profilecontact")
                  }
                >
                  Contact
                </button>
                <button
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-red-200 text-left text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
            {dropdownOpen && !isAuthenticated && (
              <div className="absolute right-0 mt-2 w-48 z-50 bg-white shadow-lg rounded-md py-2">
                <button
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
                  onClick={() => handleNavigation("/login")}
                >
                  Login
                </button>
                <button
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
                  onClick={() => handleNavigation("/signup")}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
          <div className="flex w-[50%] justify-end">
            <div className="flex mx-4"></div>
            <div
              className="p-1 cursor-pointer md:hidden block h-[40px]"
              onClick={() => setOpen(!open)}
            >
              <div className="w-[30px] m-1 h-[3px] bg-black"></div>
              <div className="w-[30px] m-1 h-[3px] bg-black"></div>
              <div className="w-[30px] m-1 h-[3px] bg-black"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
