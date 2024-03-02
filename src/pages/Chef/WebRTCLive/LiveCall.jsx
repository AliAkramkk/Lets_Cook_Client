import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../context/authReducer";
import { useSocket } from "../../../context/socketProvider";

const LiveCall = () => {
  const token = useSelector(selectCurrentToken);
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  return <div>LiveCall</div>;
};

export default LiveCall;
