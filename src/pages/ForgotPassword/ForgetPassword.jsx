import React, { useState } from "react";
import UserNavbar from "../../component/Navbar/UserNavbar";
import toast, { Toaster } from "react-hot-toast";
import axios, { axiosPrivate } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../../public/signin.jpg";
import letsCookLogo from "../../assets/Lets cook/log1.png";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(enteredEmail);

    if (!isValidEmail) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || emailError) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const response = await axios.post("/forgotPassword", { email });
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/forgot-otp");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="bg-gray-100">
        <UserNavbar />
        <div className="flex flex-col md:flex-row">
          <div className="p-3 text-white flex flex-col md:flex-row items-center md:items-start">
            <img
              src={letsCookLogo}
              alt="Let's Cook Logo"
              className="mb-4 max-w-xs md:mr-6 md:mb-0"
            />
          </div>
          <div className="max-w-lg mx-auto my-10 bg-gray-200 p-8 rounded-xl shadow shadow-slate-300 w-full md:w-3/4 lg:w-1/2">
            <h1 className="text-4xl font-medium">Reset password</h1>
            <p className="text-slate-500">
              Fill up the form to reset the password
            </p>

            <form onSubmit={handleResetPassword} className="my-10">
              <div className="flex flex-col space-y-5">
                <label htmlFor="email">
                  <p className="font-medium text-slate-700 pb-2">
                    Email address
                  </p>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full py-3 border ${
                      emailError ? "border-red-500" : "border-slate-200"
                    } rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow`}
                    placeholder="Enter email address"
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-2">{emailError}</p>
                  )}
                </label>

                <button
                  type="submit"
                  className="w-full py-3 font-medium text-white bg-black hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    {/* (your SVG path here) */}
                  </svg>

                  <span>Reset password</span>
                </button>

                <p className="text-center">
                  Not registered yet?{" "}
                  <a
                    href="/signup"
                    className="text-indigo-600 font-medium inline-flex space-x-1 items-center"
                  >
                    <span>Press Login </span>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        {/* (your SVG path here) */}
                      </svg>
                    </span>
                  </a>
                </p>
              </div>
            </form>
          </div>{" "}
          <Toaster />
        </div>
      </div>
    </>
  );
}

export default ForgetPassword;
