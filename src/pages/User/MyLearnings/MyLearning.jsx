import React, { useEffect, useState } from "react";
import UserNavbar from "../../../component/Navbar/UserNavbar";
import Footer from "../Footer/Footer";
import { axiosPrivate } from "../../../api/axios";
import { auth, selectCurrentToken } from "../../../context/authReducer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyLearning = () => {
  const user = useSelector(auth);
  const token = useSelector(selectCurrentToken);
  const usenavigate = useNavigate();
  const [courses, setCourses] = useState([]);
  console.log(user);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(
          `/user/my-learning?username=${user.user}`, // Fix typo here
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Add any other headers if needed
            },
          }
        );
        setCourses(response.data.courses);
        // Process the response data here
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call fetchData outside the try-catch block
    fetchData();
  }, []);
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(courses.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const cardStyle1 = {
    background:
      "linear-gradient(to right, rgb(235, 245, 255), rgb(255, 235, 235), rgb(255, 255, 225))",
  };
  const cardStyle3 = {
    background:
      "linear-gradient(to right, hsl(210, 60%, 95%), hsl(0, 60%, 95%), hsl(60, 100%, 95%))",
  };

  return (
    <>
      <div className="  font-serif bg-gray-100">
        <UserNavbar />
        <div className="text-center mt-8 mb-8">
          <h2 className="text-3xl font-bold text-black-600">MY LEARNINGS</h2>
        </div>
        {currentCourses.length === 0 ? (
          <div className="text-center mt-8 mb-8">
            <p className="text-lg font-medium text-gray-900">
              Hurry and purchase a course to start your culinary journey!
            </p>
          </div>
        ) : (
          <div className="flex justify-center  gap-4  flex-wrap mt-8">
            {currentCourses.map((course, i) => (
              <div
                key={i}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-80  bg-gray-200 mx-2 rounded-md my-4 overflow-hidden hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
                style={cardStyle1}
              >
                <div className="flex justify-center pt-2">
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    {course.title}
                  </p>
                </div>
                <div className="h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover px-4"
                    src={course.coverImage.url}
                    alt={course.title}
                  />
                </div>
                <div className="p-4 flex-grow">
                  <p className="text-sm text-gray-600 h-12 overflow-hidden leading-4 mb-4">
                    {course.blurb}
                  </p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() =>
                        usenavigate("/user/coursefullvideos", {
                          state: { course_id: course._id },
                        })
                      }
                      className="btn hvr-shutter-in-horizontal justify-center  rounded-md border-black text-black  px-4 py-2 hover:bg-slate-200 transition duration-300 ease-in-out"
                    >
                      Watch now
                      {/* <FontAwesomeIcon icon={faArrowRight} className="ml-2" /> */}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 p-4 flex justify-center">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`mx-2 px-3 py-1 rounded-md ${
                number === currentPage
                  ? "bg-gray-500  text-white"
                  : "bg-gray-300"
              }`}
            >
              {number}
            </button>
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MyLearning;
