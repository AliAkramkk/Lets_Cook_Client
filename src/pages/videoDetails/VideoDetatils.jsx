import React from "react";
import ChefNavbar from "../../component/Navbar/ChefNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faStar } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

const VideoDetatils = () => {
  const location = useLocation();
  const video = location?.state?.video;
  console.log(video);

  return (
    <>
      <div>
        <div className=" bg-gray-200 ">
          <ChefNavbar />
          <div className="max-w-screen-xl mx-auto mt-8 p-8 bg-white rounded-md shadow-lg">
            {/* Video Frame */}
            <div className="flex">
              <FontAwesomeIcon icon={faStar} className="mt-1 text-xs" />
              <h1 className="font-roboto mb-3 ms-3">VIDEO</h1>
            </div>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <video
                src={video.demoVideo.url}
                className="w-full max-h-screen object-cover rounded-md"
                controls
              />
            </div>
            {/* Cover Image */}
            <div className="flex">
              <FontAwesomeIcon icon={faStar} className="mt-1 text-xs" />
              <h1 className="font-roboto mb-3 ms-3">COVER IMAGE</h1>
            </div>
            <img
              src={video.coverImage.url}
              alt="Video Cover"
              className="w-96 h-64 object-cover rounded-md mb-4"
            />

            {/* Title */}
            <div className="flex">
              <FontAwesomeIcon icon={faStar} className="mt-1 text-xs" />
              <h1 className="font-roboto mb-3 ms-3">TITLE</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {video.title}
            </h2>

            {/* Description */}
            <div className="flex">
              <FontAwesomeIcon icon={faStar} className="mt-1 text-xs" />
              <h1 className="font-roboto mb-3 ms-3">DESCRIPTION</h1>
            </div>
            <p className="text-gray-600 mb-4">{video.description}</p>

            {/* Edit Button */}
            <div className="flex items-center justify-end">
              <button className="text-blue-500 hover:text-blue-700">
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default VideoDetatils;
