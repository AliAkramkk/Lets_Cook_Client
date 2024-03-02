import React, { useState, useEffect } from "react";
import { axiosPrivate } from "../../../api/axios";
import AdminNavbar from "../../../component/Navbar/AdminNavbar";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../context/authReducer";

function Cheflist() {
  const [list, setList] = useState([]);
  const token = useSelector(selectCurrentToken);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosPrivate.get("/admin/chefs?role=3000", {
          headers: {
            Authorization: `Bearer ${token}`,
            // Add any other headers if needed
          },
        });
        console.log(response.data);
        setList(response.data.chefs);
        console.log(list);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const handleToggleAccess = async (email, index) => {
    (async function () {
      try {
        // Update the local state optimistically

        // Make a request to the server to update the user's access status
        const message = await axiosPrivate.patch(
          "/admin/updateChefStatus",
          { email: email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Add any other headers if needed
            },
          }
        );
        toast.success(message.data.message);
        const response = await axiosPrivate.get("/admin/chefs?role=3000", {
          headers: {
            Authorization: `Bearer ${token}`,
            // Add any other headers if needed
          },
        });
        setList(response.data.chefs);
        // Note: The server should handle the logic to toggle the isAccess and clear JWT
      } catch (error) {
        console.log(error);
        // Handle error if needed, e.g., revert the local state change
      }
    })();
  };

  return (
    <>
      <AdminNavbar />
      <Toaster />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Serial NO
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone NO
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((chefs, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "even:bg-gray-50" : "odd:bg-white"
                } dark:border-gray-700`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {index + 1}
                </th>
                <td className="px-6 py-4">{chefs.username}</td>
                <td className="px-6 py-4">{chefs.email}</td>
                <td className="px-6 py-4">{chefs.phone}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleAccess(chefs.email, index)}
                    className={`${
                      chefs.isAccess
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    } px-4 py-2 rounded`}
                  >
                    {chefs.isAccess ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Cheflist;
