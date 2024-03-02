import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { decodeJwt } from "jose";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "../../api/axios";
import { setCredentials } from "../../context/authReducer";
// import jwt_decode from "jwt-decode";
const GoogleAuthComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clientId =
    "366855946507-rs5dhs988nto28ftiqdhjrpug9inkc31.apps.googleusercontent.com";
  const handleGoogleLogin = (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      const payload = credential ? decodeJwt(credential) : undefined;
      console.log("hi", payload);
      console.log("Credential Response:", credentialResponse);
      if (payload) {
        axios
          .post(
            "/signin/google",
            { payload },
            {
              withCredentials: true,
              credentials: "include",
            }
          )
          .then((res) => {
            console.log(res.data);
            const userCredentials = {
              user: res.data.username || res.data.name,
              userId: res.data.userId || res.data._id,
              accesstoken: res.data.accesstoken || res.data.token,
              role: res.data.role || 2000,
            };

            dispatch(setCredentials(userCredentials));
            res.data.role === 3000 ? navigate("/chef") : navigate("/");
            console.log(userCredentials);
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message);
          });
      }
    } catch (error) {
      console.error("Error in Google login:", error);
    }
  };

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </GoogleOAuthProvider>
      <Toaster />
    </>
  );
};

export default GoogleAuthComponent;
