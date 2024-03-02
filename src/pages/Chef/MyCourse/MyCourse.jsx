import React, { useState, useEffect } from "react";
import ChefNavbar from "../../../component/Navbar/ChefNavbar";
import { axiosPrivate } from "../../../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { auth, selectCurrentToken } from "../../../context/authReducer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  faArrowRight,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../../User/Footer/Footer";

const MyCourse = () => {
  const user = useSelector(auth);
  const [listAllClicked, setListAllClicked] = useState(true);
  const [unlistAllClicked, setUnlistAllClicked] = useState(false);
  const token = useSelector(selectCurrentToken);
  const [videos, setVideos] = useState([]);
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const handleshowcourses = async (id) => {
    try {
      const changedResponse = await axiosPrivate.put( "/chef/handleShowCourse",
       {id},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(changedResponse);
      toast.success(changedResponse.data.message);

      const response = await axiosPrivate.get("/chef/myCourse", {
        params: { user: user },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (listAllClicked) {
        const trueCourses = response.data.courses.filter(
          (course) => course.isShow === true
        );
        setList(trueCourses);
      } else {
        const trueCourses = response.data.courses.filter(
          (course) => course.isShow === false
        );
        setList(trueCourses);
      }
      setVideos(response.data.courses);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosPrivate.get("/chef/myCourse", {
          params: { user: user },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const trueCourses = response.data.courses.filter(
          (course) => course.isShow === true
        );
        setList(trueCourses);
        setVideos(response.data.courses);
      } catch (error) {
        console.error("Error ", error);
      }
    }

    fetchData();
  }, []);

  const handleListAll = () => {
    setListAllClicked(true);
    setUnlistAllClicked(false);
    const trueCourses = videos.filter((course) => course.isShow === true);
    setList(trueCourses);
  };

  const handleUnlistAll = () => {
    setUnlistAllClicked(true);
    setListAllClicked(false);
    const falseCourses = videos.filter((course) => course.isShow === false);
    setList(falseCourses);
  };

  const standardButtonStyle =
    "px-4 py-2 transition duration-300 ease-in-out rounded-md";
  const activeButtonStyle =
    "bg-black text-white shadow-lg shadow-red-950 scale-110";
  const inactiveButtonStyle =
    "bg-black border-white border text-white hover:bg-white hover:text-black";

  return (
    <>
      <div className=" bg-gray-200 ">
        <ChefNavbar />
        <Toaster />
        <div className="flex justify-start ms-20 gap-4 mt-4">
          <button
            onClick={handleListAll}
            className={`btn ${
              listAllClicked ? activeButtonStyle : inactiveButtonStyle
            } ${standardButtonStyle}`}
          >
            Listed
          </button>
          <button
            onClick={handleUnlistAll}
            className={`btn ${
              unlistAllClicked ? activeButtonStyle : inactiveButtonStyle
            } ${standardButtonStyle}`}
          >
            Unlisted
          </button>
        </div>
        <div className="text-center mt-8 mb-8 hvr-wobble-bottom w-full">
          <h2 className="text-3xl font-bold text-black-600">MY COURSES</h2>
        </div>
        <div className="flex justify-center sm:justify-start gap-7 sm:ms-16   flex-wrap mt-8">
          {list.map((video, index) => (
            <div
              key={video.id}
              className="video-card w-72 bg-gray-200 mx-2 rounded-md my-4 overflow-hidden hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <img
                src={video.coverImage?.url}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                <div className="justify-between flex">
                  <button
                    onClick={() =>
                      navigate("/chef/videos", { state: { id: video._id } })
                    }
                    className={`btn hvr-shutter-in-horizontal justify-center border-y rounded-md border-black  text-white bg-black py-2-500 px-4 py-2 hover:bg-black-700 ${standardButtonStyle}`}
                  >
                    Continue
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                  <button
                    onClick={() => handleshowcourses(video._id)}
                    className={`btn ${
                      video.isShow
                        ? "text-yellow-500 hover:text-yellow-700"
                        : "text-white hover:text-green-700"
                    } hvr-shutter-in-horizontal justify-center border-y rounded-md border-blacktext-white bg-black py-2-500 px-4 py-2 hover:bg-black-700 ${standardButtonStyle}`}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyCourse;
