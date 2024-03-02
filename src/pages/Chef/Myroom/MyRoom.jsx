import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../../api/axios";
import { selectCurrentToken } from "../../../context/authReducer";
import { useSelector } from "react-redux";

const MyRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const liveStream = `http://localhost:5173/user/live-room/${roomCode}`;
    console.log("token", token);
    console.log("live " + liveStream);
    try {
      const response = await axiosPrivate.post(
        "/chef/sendmail",
        { liveStreamLink: liveStream },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Add any other headers if needed
          },
        }
      );

      // Replace 'placeholderRoomCode' with the actual variable or value you intend to use

      navigate(`/chef/room/${roomCode}`);
    } catch (error) {
      // Handle errors, e.g., log them or show a user-friendly message
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex justify-center bg-slate-400">
        <form onSubmit={handleFormSubmit} className="form">
          <div>
            <label className="block justify-center">Enter the room Id</label>
            <input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              type="text"
              required
              placeholder="Enter the Room Id"
            />
          </div>
          <button type="submit">Enter Room</button>
        </form>
      </div>
    </>
  );
};

export default MyRoom;
