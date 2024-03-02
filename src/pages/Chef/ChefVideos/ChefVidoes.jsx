import React, { useState, useEffect } from "react";
import ChefNavbar from "../../../component/Navbar/ChefNavbar";
import { axiosPrivate } from "../../../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { selectCurrentToken } from "../../../context/authReducer";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  faEdit,
  faEye,
  faEyeSlash,
  faPlusCircle,
  faStar,
  faTools,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../../User/Footer/Footer";

const ChefVidoes = () => {
  const usenavigate = useNavigate();
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const course_id = location.state?.id;
  console.log("course_id", course_id);
  const [video, setVideo] = useState([]);
  const showDeleteAlert = async (onDelete) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      onDelete();
    }
  };

  useEffect(() => {
    const fetchChefCourse = async () => {
      try {
        const response = await axiosPrivate.get(
          `/chef/getcourse/${course_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Add any other headers if needed
            },
          }
        );
        setVideo(response.data.course);
        console.log("response", response.data.course);
      } catch (error) {
        console.error("Error ", error);
      }
    };

    fetchChefCourse();
  }, []);

  const handleshowcourses = async (id) => {
    try {
      const newResponse = await axiosPrivate.put(
        "/chef/handleShowCourse",
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(newResponse.data.message);
      const response = await axiosPrivate.get(`/chef/getcourse/${course_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Add any other headers if needed
        },
      });
      setVideo(response.data.course);
    } catch (error) {
      console.log(error.message);
    }
  };
  const editCourses = async (id) => {
    usenavigate("/chef/edit-course", {
      state: { courseID: id },
    });
  };

  const deleteCourses = async (id) => {
    console.log("Delete function started");
    showDeleteAlert(async () => {
      try {
        console.log("Inside showDeleteAlert");
        // Check if the course has been purchased
        const paymentRecord = await axiosPrivate.get(
          `/chef/checkPayment/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("payment", paymentRecord);
        if (paymentRecord.data.purchased) {
          // If purchased, show an error message
          toast.error("Cannot delete purchased course.");
          return;
        }

        // If not purchased, proceed with deletion
        const changedResponse = await axiosPrivate.delete(
          `/chef/deleteCourse/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Add any other headers if needed
            },
            withCredentials: true,
          }
        );

        toast.success(changedResponse.data.message);
        usenavigate("/chef/my-course");

        const response = await axiosPrivate.get(
          `/chef/getcourse/${course_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Add any other headers if needed
            },
          }
        );
        setVideo(response.data.course);
      } catch (error) {
        console.log(error.message);
      }
    });
  };

  const deleteChapter = async (id, index) => {
    showDeleteAlert(async () => {
      try {
        const changedResponse = await axiosPrivate.put(
          "/chef/delete-chapter",
          {
            id,
            index,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Add any other headers if needed
            },
          }
        );

        toast.success(changedResponse.data.message);

        const response = await axiosPrivate.get(
          `/chef/getcourse/${course_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Add any other headers if needed
            },
          }
        );
        setVideo(response.data.course);
        console.log("response data", response.data.course);
      } catch (error) {
        console.log(error.message);
      }
    });
  };

  const cardStyle4 = {
    background:
      "linear-gradient(to right, hsl(210, 40%, 95%), hsl(0, 40%, 95%), hsl(60, 100%, 95%))",
  };
  return (
    <>
      <div className=" bg-gray-200 ">
        <div className="h-screen overflow-hidden">
          <ChefNavbar />
          <Toaster />

          <div className="flex flex-col-reverse   md:flex-row">
            <div className="w-full md:w-2/3 p-4  mb-48 md:mb-0 sticky top-0 overflow-hidden  ">
              <div
                className="max-w-screen-xl mt-2 mx-auto  overflow-y-auto h-screen rounded-lg mb-36"
                style={cardStyle4}
              >
                <div className="text-center   pt-4 mb-4" style={cardStyle4}>
                  <h2 className="text-lg font-bold text-black-600">
                    COURSES DETAILSE
                  </h2>
                </div>
                {/* ... (your existing right card content) */}
                <div
                  className="max-w-screen-xl mx-auto p-8 pt-0  bg-white "
                  style={cardStyle4}
                >
                  {/* Video Frame */}
                  <div className="flex">
                    <FontAwesomeIcon icon={faStar} className="mt-1 text-xs" />
                    <h1 className="font-roboto mb-3 ms-3">VIDEO</h1>
                  </div>
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <video
                      src={video.demoVideo?.url}
                      className="w-5/6 h-96 object-cover rounded-md"
                      poster={video[0]?.coverImage?.url}
                      controls
                    />
                  </div>
                  {/* Cover Image */}
                  <div className="flex">
                    <FontAwesomeIcon icon={faStar} className="mt-1 text-xs" />
                    <h1 className="font-roboto mb-3 ms-3">COVER IMAGE</h1>
                  </div>
                  <img
                    src={video.coverImage?.url}
                    alt="Video Cover"
                    className="w-96 h-72 object-cover rounded-md mb-4"
                  />

                  {/* Title */}
                  <div className="flex">
                    <FontAwesomeIcon icon={faStar} className="mt-1 text-xs" />
                    <h1 className="font-roboto mb-3 ms-3">TITLE</h1>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {video.title}
                  </h2>

                  {/* Blurb */}
                  <div className="flex">
                    <FontAwesomeIcon icon={faStar} className="mt-1 text-xs" />
                    <h1 className="font-roboto mb-3 ms-3">BLURB</h1>
                  </div>
                  <p className="text-gray-600 mb-2">{video.blurb}</p>

                  {/* Description */}
                  <div className="flex">
                    <FontAwesomeIcon icon={faStar} className="mt-1 text-xs" />
                    <h1 className="font-roboto mb-3 ms-3">DESCRIPTION</h1>
                  </div>
                  <p className="text-gray-600 mb-4">{video.description}</p>

                  {/* Price */}
                  <div className="flex">
                    <FontAwesomeIcon icon={faStar} className="mt-1 text-xs" />
                    <h1 className="font-roboto mb-3 ms-3">PRICE</h1>
                  </div>
                  <p className="text-lg font-bold text-green-500 mb-2">
                    ${video.price}
                  </p>

                  {/* Category */}
                  <div className="flex">
                    <FontAwesomeIcon icon={faStar} className="mt-1 text-xs" />
                    <h1 className="font-roboto mb-3 ms-3">CATEGORY</h1>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Category: {video.category}
                  </p>

                  {/* About Chef */}
                  <div className="flex">
                    <FontAwesomeIcon icon={faStar} className="mt-1 text-xs" />
                    <h1 className="font-roboto mb-3 ms-3">ABOUT CHEF</h1>
                  </div>
                  <div className="mb-4">
                    {/* <h3 className="text-xl font-bold text-gray-800 mb-2">About the Chef</h3> */}
                    <p className="text-gray-600">{video.aboutChef}</p>
                  </div>

                  {/* Buttons Section */}
                  <div className="flex items-center justify-between border-y-2 py-4">
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteCourses(video._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                      Delete
                    </button>

                    {/* Hide Button */}
                    <button
                      onClick={() => handleshowcourses(video._id)}
                      className={`${
                        video.isShow
                          ? "text-yellow-500 hover:text-yellow-700"
                          : "text-green-500 hover:text-green-700"
                      }`}
                    >
                      {video.isShow ? (
                        <>
                          <FontAwesomeIcon icon={faEyeSlash} className="mr-2" />
                          Hide
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faEye} className="mr-2" />
                          Show
                        </>
                      )}
                    </button>

                    {/* More Button (Ellipsis) */}
                    <button
                      onClick={() => editCourses(video._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      Edit
                    </button>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() =>
                        usenavigate("/chef/add-chapter", {
                          state: { id: video._id },
                        })
                      }
                      className="btn btn-primary border hvr-float-shadow bg-black text-white hover:bg-gray-800 transition duration-300 ease-in-out py-2 px-6 text-lg rounded-md"
                    >
                      <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                      Upload New Chapter
                    </button>
                  </div>
                </div>
                <div className="h-16 bg-slate-600"></div>
              </div>
            </div>

            {/* Right Card */}
            {/* <div className="w-full md:w-1/3 p-4 md:ml-4 mt-4 md:mt-0"> */}
            {/* <div className="sticky top-0"> */}
            {/* <div className="max-w-screen-xl mx-auto bg-white rounded-md shadow-lg"> */}
            <div className="w-full md:w-1/3 p-4 mb-4 md:mb-0 sticky top-0 overflow-hidden ">
              <div
                className="max-w-screen-xl mt-2 mx-auto bg-white rounded-md  overflow-y-auto h-screen"
                style={cardStyle4}
              >
                <div className="text-center   pt-4 mb-4">
                  <h2 className="text-lg font-bold text-black-600">CHAPTERS</h2>
                </div>

                {/* Card Section */}
                {video?.chapters?.map((chapter, i) => (
                  <div
                    className="max-w-2xl mx-auto  border-y bg-blue-50 p-8 mb-8"
                    style={cardStyle4}
                  >
                    {/* ... (your existing left card content) */}
                    <div className="mb-4">
                      <img
                        src={chapter.coverImage.url}
                        alt="Course Cover"
                        className="w-full h-64 object-cover rounded-md"
                      />
                    </div>

                    {/* Video Title */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {chapter.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4">{chapter.description}</p>

                    {/* Buttons Section */}
                    <div className="flex items-center justify-between border-t-2 pt-4">
                      {/* Delete Button */}
                      <button
                        onClick={() => deleteChapter(video._id, chapter.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                        Delete
                      </button>

                      {/* Hide Button */}
                      <button
                        onClick={() => handleshowcourses(video._id)}
                        className={`${
                          video.isShow
                            ? "text-yellow-500 hover:text-yellow-700"
                            : "text-green-500 hover:text-green-700"
                        }`}
                      >
                        {video.isShow ? (
                          <>
                            <FontAwesomeIcon
                              icon={faEyeSlash}
                              className="mr-2"
                            />
                            Hide
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faEye} className="mr-2" />
                            Show
                          </>
                        )}
                      </button>

                      {/* More Button (Ellipsis) */}
                      <button
                        onClick={() =>
                          usenavigate("/chef/video-details", {
                            state: { video: chapter },
                          })
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FontAwesomeIcon icon={faTools} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="h-12 bg-slate-600 justify-center flex items-center">
                  {video?.chapters?.length == 0 && (
                    <p className=" text-white">Please add chapters !</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChefVidoes;
