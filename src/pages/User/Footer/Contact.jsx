import React from "react";
import { auth } from "../../../context/authReducer";
import { useSelector } from "react-redux";
import UserNavbar from "../../../component/Navbar/UserNavbar";
import ChefNavbar from "../../../component/Navbar/ChefNavbar";
import AdminNavbar from "../../../component/Navbar/AdminNavbar";
import Footer from "./Footer";
import backgroundImage from "../../../../public/signin.jpg"; // Adjust the image path
import letsCookLogo from "../../../assets/Lets cook/log1.png";
import Contactcard from "../../../component/Card/Contactcard";
const Contact = () => {
  const user = useSelector(auth);
  const getNavbar = () => {
    if (user.role === 1000) {
      return <AdminNavbar />;
    } else if (user.role === 3000) {
      return <ChefNavbar />;
    } else {
      return <UserNavbar />;
    }
  };

  return (
    <>
      <div className="bg-gray-100">
        {getNavbar()}
        <div
          className="min-h-screen flex flex-col  items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-center text-gray-100 justify-center text-5xl p-2 font-extrabold">
            Contact Page
          </h1>
          <div className="p-3 text-white flex flex-col md:flex-row items-center md:items-start">
            <img
              src={letsCookLogo}
              alt="Let's Cook Logo"
              className="mb-4 max-w-xs md:mr-6 md:mb-0"
            />
            <h3 className="text-lg md:text-xl lg:text-2xl mt-4 md:mt-20 mb-20 text-center md:text-left">
              Welcome to <strong>Let's Cook</strong>! We are passionate about
              bringing the joy of cooking to your fingertips.
            </h3>
          </div>
          <div className="flex justify-center items-center mb-8">
            <Contactcard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
