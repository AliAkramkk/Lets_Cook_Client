import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import UserNavbar from "../../component/Navbar/UserNavbar";
import { auth } from "../../context/authReducer";
import toast, { Toaster } from "react-hot-toast";
import { axiosPrivate } from "../../api/axios";
import { useNavigate } from "react-router-dom";
const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const user = useSelector(auth);
  console.log("user", user);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^[0-9]$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
    } else {
      const updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);
    }
    if (index < inputRefs.length - 1 && value !== "") {
      inputRefs[index + 1].current.focus();
    } else if (index > 0 && value === "") {
      inputRefs[index - 1].current.focus();
      const updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);
    }
  };
  const handleSubmit = async () => {
    try {
      let OTP = otp.join("");
      console.log(OTP);
      const response = await axiosPrivate.post("/forgot-otp", { OTP });
      console.log(response);
      if (response.status === 201) {
        toast.success(response.data.message, { duration: 3000 });
        setTimeout(() => {
          navigate("/reset-password");
        }, 3000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {}
  };
  return (
    <>
      <UserNavbar />
      <div className="otp-container ">
        <p>An OTP is send to your mail</p>
        <h1>Enter OTP</h1>
        <div className="otp-input">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="number"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              className="otp-digit"
              ref={inputRefs[index]}
            />
          ))}
        </div>
        <button onClick={handleSubmit} className="submit-button">
          Submit
        </button>
      </div>
      <Toaster />
    </>
  );
};

export default Otp;
