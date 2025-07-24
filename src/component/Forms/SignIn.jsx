import React, { useState } from "react";
import axios from "axios";
import { axiosPrivate } from "../../api/axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { useFormik } from "formik";
import { signinValidation } from "../signinValidation";
import { useLocation, useNavigate } from "react-router-dom";
import { setCredentials } from "../../context/authReducer";
import { useDispatch } from "react-redux";
import backgroundImage from "../../../public/signin.jpg";
import GoogleAuthComponent from "../../pages/SignIn/Auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import UserNavbar from "../Navbar/UserNavbar";
import SignInNavbar from "../Navbar/SignInNavbar";

function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname;
  console.log("location", location);
  const course_id = location.state?.id;
  console.log(course_id);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { values, handleChange, handleSubmit, errors } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signinValidation, // You'll need to create this validation schema
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/signin",
          values,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        console.log("server response", response.data);
        console.log("sign 1", response.data.user);
        if (response.data && response.data.error) {
          // Use SweetAlert for error notification
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.data.message,
          });
        } else {
          console.log("Signin successful:", response.data.role);
          dispatch(
            setCredentials({
              user: response.data.user,
              role: response.data.role,
              token: response.data.accessToken,
              id: response.data.id,
            })
          );
          // from === "/coursedetails"
          //     ? navigat("/coursedetails", {
          //         state: { id: course_id },
          //       })
          //     : navigat(from || "/", { replace: true });

          if (response.data.role === 2000) {
            from === "/coursedetails"
              ? navigate("/coursedetails/", {
                  state: { id: course_id },
                })
              : navigate(from || "/", { replace: true });
          } else if (response.data.role === 1000) {
            navigate(from || "/admin", { replace: true });
          } else if (response.data.role === 3000) {
            navigate(from || "/chef", { replace: true });
          }
        }
      } catch (error) {
        console.error("Error during signin:", error);
        console.log("Error response from server:", error.response);

        // Display the error message from the server, if available
        const errorMessage =
          error.response?.data?.message || "An error occurred during signin.";

        console.log("Received error message:", errorMessage);

        // Use SweetAlert for error notification
        Swal.fire({
          text: errorMessage,
        });

        setError(errorMessage);
      }
    },
  });
  const cardStyle4 = {
    background:
      "linear-gradient(to right, hsl(210, 40%, 95%), hsl(0, 40%, 95%), hsl(60, 100%, 95%))",
  };

  return (
    <>
      <SignInNavbar />
      <div
        className="min-h-screen flex flex-col items-start justify-start bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div
          className="flex-row justify-center p-6 m-6 rounded-lg"
          style={{
            background:
              "linear-gradient(to right, hsl(210, 40%, 95%), hsl(0, 40%, 95%), hsl(60, 100%, 95%))",
          }}
        >
          <div className="flex items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 w-full sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
            <div className="w-full space-y-8">
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Sign in
              </h2>
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div
                  className="rounded-md shadow-sm -space-y-px"
                  style={cardStyle4}
                >
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="text"
                      autoComplete="email"
                      value={values.email}
                      onChange={handleChange}
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <br />
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={values.password}
                        onChange={handleChange}
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                      />
                      <span
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-400" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-400" />
                        )}
                      </span>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign In
                  </button>
                </div>
                <div className="w-full md:w-2/3 flex items-center justify-center gap-2 mx-auto">
                  <hr className="w-1/3 md:w-1/3 border-t-2 border-gray-500 " />
                  <span>Or</span>
                  <hr className="w-1/3 border-t-2 border-gray-500 " />
                </div>
                <div className="w-1/2 flex justify-center mx-auto">
                  <GoogleAuthComponent />
                </div>
              </form>
              <div className="mt-5 text-lg flex justify-between items-center text-[#002D74]">
                <p>Don't have an account?</p>
                <button
                  onClick={() => {
                    navigate("/signup");
                  }}
                  className="py-2 px-3 dark-bg-gray-900 bg-white border rounded-xl hover:scale-110 duration-300"
                >
                  Register
                </button>
              </div>
              <div className="mt-8 text-lg border-t border-[#002D74] py-5 text-[#002D74] text-center dark:text-blue-400">
                <a href="/forgot-password">Forgot your password?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signin;
