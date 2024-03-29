import React, { useState, useEffect } from "react";
import UserNavbar from "../Navbar/UserNavbar";
import { axiosPrivate } from "../../api/axios";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";

import EditProfile from "./EditProfile";
import Footer from "../../pages/User/Footer/Footer";

function ProfilePage({ data, fetchData, setData }) {
  const dateTimeString = data.createdAt;
  const dateOnlyString = dateTimeString ? dateTimeString.split("T")[0] : "";
  console.log(data);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openModal = () => {
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
  };
  return (
    <>
      <div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
        <div className="rounded-t-lg h-32 overflow-hidden">
          <img
            className="object-cover object-top w-full"
            src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
            alt="Mountain"
          />
        </div>

        <div className="mx-auto w-32 h-32  -mt-16 border-4 border-white rounded-full overflow-hidden">
          <img
            className="object-cover object-center h-32"
            src={data.pic}
            alt="t"
          />
        </div>
        <div className="text-center mt-2">
          <h2 className="font-semibold">{data.username}</h2>
          <p className="text-gray-500">{data.email}</p>
        </div>
        <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
          <li className="flex flex-col items-center justify-around">
            <div className="text-xs text-gray-500">Phone Number</div>
            <div className="font-semibold">{data.phone}</div>
          </li>
          {/* <li className="flex flex-col items-center justify-around">
            <div className="text-xs text-gray-500">Email</div>
            <div className="font-semibold">{data.email}</div>
          </li> */}
          <li className="flex flex-col items-center justify-around">
            <div className="text-xs text-gray-500">Join Date</div>
            <div className="font-semibold">{dateOnlyString}</div>
          </li>
        </ul>
        <div className="p-4 border-t mx-8 mt-2">
          <button
            className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2"
            onClick={openModal}
          >
            Edit
          </button>
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfile
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          userData={data}
          fetchData={fetchData}
          setData={setData}
        />
      )}
      <Footer />
    </>
  );
}

export default ProfilePage;
