import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, logOut } from "../../context/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spin as Hamburger } from "hamburger-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function ChefNavbar() {
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
      "linear-gradient(to right,  rgb(250, 224, 226), rgb(189, 193, 199))",
  };

  return (
    <nav className="bg-gray-800 p-4" style={navbarStyle}>
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/chef/" className="text-gray-600 text-2xl font-bold">
            Let's Cook
          </Link>
        </div>
        <div className="hidden md:flex space-x-4 text-gray-500 lg:mb-0 font-bold dark:text-gray-400  me-4 md:me-6">
          {[
            { path: "/chef/", label: "DASHBOARD" },
            { path: "/chef/my-course", label: "MY CLASS" },
            { path: "/chef/transaction", label: "PAYMENT" },
            // { path: "/chat", label: "COMMUNITY" },
            // { path: "/blog", label: "BLOG" },
          ].map((item) => (
            <button
              key={item.path}
              className="nav-button p-2  hvr-underline-from-center  hover:transform hover:shadow-md transition-transform duration-300 hover:bg-gray hover:animate-shake"
              onClick={() => usenavigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* <Link
            to="/chef/courseList"
            className="text-gray-500 lg:mb-0 font-semibold dark:text-gray-400 hover:underline me-4 md:me-6"
          >
            CLASSES
          </Link>
          <Link
            to="/chef/my-course"
            className="text-gray-500 lg:mb-0 font-semibold dark:text-gray-400 hover:underline me-4 md:me-6"
          >
            MY COURSE
          </Link>
          <Link
            to="/chef/transaction"
            className="text-gray-500 lg:mb-0 font-semibold dark:text-gray-400 hover:underline me-4 md:me-6"
          >
            TRANSACTION
          </Link> */}
        {/* Add other navigation links as needed */}
        <div className="flex items-center space-x-4">
          {!user?.user ? (
            <div
              className="hidden md:flex items-center space-x-4"
              onClick={() => useNavigate("/signin")}
            >
              <a
                href="#"
                className="border rounded px-2 py-1 text-black hover:transform hover:shadow-md transition-transform duration-300 hover:bg-gray-300 hover:animate-shake"
              >
                LOGIN
              </a>
            </div>
          ) : (
            <>
              <div className="hidden md:flex me-4">
                <div
                  className="flex items-end me-4 cursor-pointer"
                  onClick={() => {
                    usenavigate("/chef/profile");
                  }}
                >
                  {user?.pro ? (
                    user.pro
                  ) : (
                    <FontAwesomeIcon className="me-1" icon={faUser} size="lg" />
                  )}
                  <span className="text-white hover:animate-shake">
                    {user?.user}
                  </span>
                </div>
                <button
                  className="border rounded px-2 py-1 text-white hover:bg-gray-300 hover:animate-shake"
                  onClick={HandlelogOut}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Hamburger toggled={isMobileMenuOpen} toggle={toggleMobileMenu} />
          {isMobileMenuOpen && (
            //   <div className="mobile-menu md:hidden">
            //     <Link to="/home" className="nav-link">
            //       Home
            //     </Link>
            //     <Link to="/course" className="nav-link">
            //       Course
            //     </Link>
            //     <Link to="/community" className="nav-link">
            //       Community
            //     </Link>
            //     <Link to="/blog" className="nav-link">
            //       Blog
            //     </Link>
            //     {!user?.user ? (
            //       <Link to="/login" className="nav-link">
            //         Login
            //       </Link>
            //     ) : (
            //       <Link to="/profile" className="nav-link">
            //         Profile
            //       </Link>
            //     )}
            //   </div>
            // )}
            <div
              className="absolute z-50 top-16 left-0 right-0 bg-gray-800"
              style={navbarStyle}
            >
              {[
                { path: "/chef/", label: "DASHBOARD" },
                { path: "/chef/my-course", label: "MY CLASS" },
                { path: "/chef/transaction", label: "PAYMENT" },
                // { path: "/chat", label: "COMMUNITY" },
                // { path: "/blog", label: "BLOG" },
              ].map((item) => (
                <button
                  key={item.path}
                  className="nav-button p-2  hvr-underline-from-center  hover:transform hover:shadow-md transition-transform duration-300 hover:bg-gray hover:animate-shake"
                  onClick={() => usenavigate(item.path)}
                >
                  {item.label}
                </button>
              ))}
              {!user?.user ? (
                <div
                  className="hidden signinandsignup md:flex space-x-4"
                  onClick={handlelogin}
                >
                  <Link to="/login" className="logbutton">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    LOGIN
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div
                    className="cursor-pointer flex items-end"
                    onClick={() => {
                      usenavigate("/chef/profile");
                    }}
                  >
                    {user?.pro ? (
                      user.pro
                    ) : (
                      <FontAwesomeIcon
                        className="me-1"
                        icon={faUser}
                        size="lg"
                      />
                    )}
                    <span className="text-white">{user?.user}</span>
                  </div>
                  <button className="border rounded p-1" onClick={HandlelogOut}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* <img
        src="assets/img/avatars/avatar4.png"
        className="h-12 w-12 rounded-full"
        alt="avatar"
      /> */}
    </nav>
  );
}

export default ChefNavbar;
