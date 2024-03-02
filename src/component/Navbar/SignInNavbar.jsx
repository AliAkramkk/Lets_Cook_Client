import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, logOut } from "../../context/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spin as Hamburger } from "hamburger-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBook,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const SignInNavbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector(auth);
  const usenavigate = useNavigate();
  const dispatch = useDispatch();

  const navbarStyle = {
    background:
      "linear-gradient(to right,  rgb(223, 224, 226), rgb(189, 193, 199))",
  };

  const HandlelogOut = (e) => {
    e.preventDefault();
    dispatch(logOut());
    usenavigate("/signin");
  };

  const handleLogin = () => {
    usenavigate("/signin");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4" style={navbarStyle}>
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link
            to="/"
            className="text-white text-2xl font-bold hover:text-black"
          >
            Let's Cook
          </Link>
        </div>
        <div className="hidden md:flex space-x-4">
          <Link
            to="/"
            className="text-gray-500 lg:mb-0 font-semibold dark:text-gray-400 hover:underline me-4 md:me-6"
          >
            <FontAwesomeIcon icon={faHome} className="me-1" /> HOME
          </Link>
          <Link
            to="/all-courses"
            className="text-gray-500 lg:mb-0 font-semibold dark:text-gray-400 hover:underline me-4 md:me-6"
          >
            <FontAwesomeIcon icon={faBook} className="me-1" /> COURSES
          </Link>

          {/* Add more links as needed */}
        </div>
        <div className="md:hidden" onClick={toggleMobileMenu}>
          <Hamburger />
        </div>
        {isMobileMenuOpen && (
          <div className="mobile-menu md:hidden">
            {/* Add mobile menu links */}
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/all-courses" className="nav-link">
              Courses
            </Link>

            {
              <a href="#" className="nav-link">
                Login
              </a>
            }
          </div>
        )}

        <div className="hidden md:flex items-center space-x-4">
          <a
            href="/signin"
            className="border rounded px-2 py-1 text-black "
            onClick={handleLogin}
          >
            LOGIN
          </a>

          {/* <img
              src="assets/img/avatars/avatar4.png"
              className="h-12 w-12 rounded-full"
              alt="avatar"
            /> */}
        </div>
      </div>
    </nav>
  );
};

export default SignInNavbar;
