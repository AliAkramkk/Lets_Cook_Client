import React, { useState } from "react";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { axiosPrivate } from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../context/authReducer";

const editProfileValidation = Yup.object({
  username: Yup.string().min(3).required("Please enter a valid username"),
  phone: Yup.string()
    .matches(/^\+(?:[0-9]●?){6,14}[0-9]$/, "Invalid phone number format")
    .required("Please enter a valid phone number"),
});

const EditProfile = ({
  isEditModalOpen,
  setIsEditModalOpen,
  userData,
  setData,
}) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const token = useSelector(selectCurrentToken);
  const toggleModal = () => {
    setIsEditModalOpen(false);
  };

  const isValidFileUploaded = (file) => {
    const validExtensions = ["png", "jpeg", "jpg"];
    const fileExtension = file.type.split("/")[1];
    return validExtensions.includes(fileExtension);
  };

  const handleImage = (e) => {
    if (isValidFileUploaded(e.target.files[0])) {
      setProfilePicture(e.target.files[0]);
      ImageTOBase(e.target.files[0]);
    } else {
      ("Invalid File type");
    }
  };

  const ImageTOBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFinalImage(reader.result);
    };
  };

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: {
      username: userData.username,
      phone: userData.phone || "",
    },
    validationSchema: editProfileValidation,
    onSubmit: async (values) => {
      try {
        const response = await axiosPrivate.patch(
          "/user/editprofile",
          {
            username: values.username,
            phone: values.phone,
            email: userData.email,
            pic: finalImage,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Add any other headers if needed
            },
          }
        );

        console.log("success edit profile");
        console.log("abcd", response.data.updatedUser.username);
        console.log("state", values.username);

        setData(response?.data?.updatedUser);
        setIsEditModalOpen(false);
      } catch (error) {
        console.log("something went wrong", error);
      }
    },
  });

  return (
    <>
      {/* {isEditModalOpen && ( */}
      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden={!isEditModalOpen}
        className="fixed top-9 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Details
              </h3>
              <button
                onClick={toggleModal}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <form class="p-4 md:p-5" onSubmit={handleSubmit}>
              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2">
                  <label
                    htmlFor="profilePicture"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="proimage"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleImage}
                  />
                </div>
                <div class="col-span-2">
                  <label
                    htmlFor="name"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    UserName
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
                <div class="col-span-2">
                  <label
                    htmlFor="number"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                Add
                new
                product
              >
                {/* <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg> */}
                Submit
              </button>
            </form>
          </div>
        </div>
        <Toaster />
      </div>
      {/* )} */}
    </>
  );
};

export default EditProfile;
