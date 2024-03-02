import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const maxLength = 200;

  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  const truncatedDescription = blog?.description?.slice(0, 100);
  const cardStyle1 = {
    background:
      "linear-gradient(to right, rgb(250, 230, 205), rgb(255, 235, 235), rgb(255, 255, 225))",
  };
  return (
    //     <div
    //       className="w-full h-36 flex shadow-md cursor-pointer"
    //       onClick={() =>
    //         navigate("/user/blogDetails", {
    //           state: { blogId: blog._id, prevLocation: location },
    //         })
    //       }
    //     >
    //       <div className=" h-full w-5/6">
    //         <div className=" h-1/6 pl-2 text-verySmall-1 flex items-center">
    //           {blog?.user?.fullname}
    //         </div>
    //         <div className=" h-1/6 font-bold text-lg px-2 flex items-center truncate">
    //           {blog?.title}
    //         </div>
    //         <div className=" text-sm h-3/6 w-full p-2 overflow-hidden break-words overflow-ellipsis">
    //           <span className="mr-2">{blog?.description.slice(0, maxLength)}</span>
    //           {blog?.description?.length > maxLength && (
    //             <span className="underline text-blue-600 text-verySmall-1">
    //               Read More...
    //             </span>
    //           )}
    //         </div>
    //       </div>
    //       <img src={blog?.coverImage?.url} className="w-1/6 h-full" alt="pic" />
    //     </div>
    //   );
    // };
    <div className="flex justify-center">
      <div
        className="w-full sm:w-1/2 md:w-1/3 lg:w-80  bg-gray-200 mx-2 rounded-md my-4 overflow-hidden hover:bg-gray-300 transition duration-1000 ease-out-in transform hover:scale"
        // style={cardStyle1}
      >
        <div className="flex justify-center pt-2">
          <p className="text-lg font-semibold text-gray-800 mb-2"></p>
        </div>
        <Link>
          <img
            className="w-full h-56 object-cover px-4 transition duration-300 ease-in-out transform hover:scale-105"
            style={{ objectFit: "cover" }}
            src={blog.coverImage.url}
            alt=""
          />
        </Link>
        <div className="p-5">
          <Link>
            <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">
              {blog.title}
            </h5>
          </Link>
          <p className="font-normal text-gray-700 mb-3">
            {showFullDescription ? blog?.description : truncatedDescription}
            {!showFullDescription && truncatedDescription?.length >= 20 && (
              <span
                className="text-blue-500 cursor-pointer"
                onClick={toggleDescription}
              >
                {" "}
                Read More
              </span>
            )}
            {showFullDescription && (
              <span
                className="text-blue-500 cursor-pointer"
                onClick={toggleDescription}
              >
                {" "}
                Read Less
              </span>
            )}
          </p>
          <button
            className="text-white bg-gray-700 hover:bg-gray-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
            onClick={() =>
              navigate("/user/blogDetails", {
                state: { blogId: blog._id, prevLocation: location },
              })
            }
          >
            Blog Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
