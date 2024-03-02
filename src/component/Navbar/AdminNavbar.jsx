import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, logOut } from "../../context/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spin as Hamburger } from "hamburger-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function AdminNavbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector(auth);
  const usenavigate = useNavigate();
  const dispatch = useDispatch();

  const HandlelogOut = (e) => {
    e.preventDefault();
    dispatch(logOut());
    usenavigate("/signin");
  };

  const handlelogin = () => {
    usenavigate("/signin");
  };
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };
  const navbarStyle = {
    background:
      "linear-gradient(to right,  rgb(223, 224, 226), rgb(189, 193, 199))",
  };

  return (
    <nav className="bg-gray-800 p-4" style={navbarStyle}>
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/admin" className="text-white text-2xl font-bold">
            Let's Cook
          </Link>
        </div>
        <div className="hidden md:flex space-x-4">
          <Link
            to="/admin"
            className="text-white hover:text-gray-300 transition"
          >
            DASHBOARD
          </Link>
          <Link
            to="/admin/userlist"
            className="text-white hover:text-gray-300 transition"
          >
            STUDENTS
          </Link>
          <Link
            to="/admin/cheflist"
            className="text-white hover:text-gray-300 transition"
          >
            CHEFS
          </Link>
          <Link
            to="/admin/category"
            className="text-white hover:text-gray-300 transition"
          >
            CATEGORY
          </Link>
          <Link
            to="/admin/transaction"
            className="text-white hover:text-gray-300 transition"
          >
            TRANSACTIONS
          </Link>
          {/* <Link
            to="/admin/allCourse"
            className="text-white hover:text-gray-300 transition"
          >
            COURSE
          </Link> */}
        </div>
        <div className="md:hidden" onClick={toggleMobileMenu}>
          <Hamburger />
        </div>
        {isMobileMenuOpen && (
          <div className="mobile-menu md:hidden">
            <Link to="/admin" className="nav-link">
              DASHBOARD
            </Link>
            <Link to="/admin/userlist" className="nav-link">
              STUDENTS
            </Link>
            <Link to="/admin/cheflist" className="nav-link">
              CHEFS
            </Link>
            <Link
              to="/admin/category"
              className="text-white hover:text-gray-300 transition"
            >
              CATEGORY
            </Link>
          </div>
        )}
        <div className="flex items-center">
          {!user?.user ? (
            <div
              className="hidden md:flex space-x-4 signinandsignup"
              onClick={handlelogin}
            >
              <a href="#" className="logbutton">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                LOGIN
              </a>
            </div>
          ) : (
            <>
              <button
                className="ms-3 mt-2 border rounded p-1"
                onClick={HandlelogOut}
              >
                Logout
              </button>
              <div
                className="flex items-center ms-3 cursor-pointer signinandsignup"
                onClick={() => {
                  usenavigate("/user/profile");
                }}
              >
                {user?.pro ? (
                  user.pro
                ) : (
                  <FontAwesomeIcon className="me-1" icon={faUser} size="lg" />
                )}
                <span className="text-white">{user?.user}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
