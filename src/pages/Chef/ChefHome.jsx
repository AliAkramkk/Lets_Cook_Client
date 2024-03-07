import React, { useState, useEffect } from "react";
import ChefNavbar from "../../component/Navbar/ChefNavbar";
import Footer from "../User/Footer/Footer";
import totalstd from "../../assets/Lets cook/stud.png";
import course from "../../assets/Lets cook/course.png";
import certificate from "../../assets/Lets cook/cer.png";
import revenue from "../../assets/Lets cook/revenue.png";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import { auth, selectCurrentToken } from "../../context/authReducer";
import { useSelector } from "react-redux";
import TeacherDashboardGraph from "../../component/TeacherComponent/TeacherDashboardGraph";
import "../../component/Navbar/UserNavbarStyle.css";

function ChefHome() {
  const navigate = useNavigate();
  const user = useSelector(auth);
  const token = useSelector(selectCurrentToken);
  const [courses, setCourses] = useState([]);
  const [details, setDetails] = useState(null);

  const handleCourse = () => {
    navigate("/chef/add-course");
  };

  const handleRoom = () => {
    navigate("/chef/my-room");
  };

  useEffect(() => {
    const fetchChefDetails = async () => {
      try {
        const response = await axiosPrivate.get("/chef/chefDetails", {
          params: user,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log("response", response.data);
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching chef details:", error);
      }
    };
    fetchChefDetails();
  }, [user]);

  useEffect(() => {
    const fetchChefCourse = async () => {
      try {
        const response = await axiosPrivate.get("/chef/currentChefCourse", {
          params: user,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log(response.data);
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching chef courses:", error);
      }
    };
    fetchChefCourse();
  }, [user]);
  const cardStyle3 = {
    background:
      "linear-gradient(to right, hsl(210, 60%, 95%), hsl(0, 60%, 95%), hsl(60, 100%, 95%))",
  };
  return (
    <>
      <div className="bg-gray-200">
        <ChefNavbar />
        <div className="text-4xl font-bold text-gray-800 mb-4 mt-4 p-3 text-start">
          Hello {user.user}
          <br />
          <span className="text-2xl text-lime-600">Welcome To Let's Cook!</span>
          <br />
          <span className="text-2xl text-black">
            Congratulation, You Have Some Good News
          </span>
        </div>
        {courses.length > 0 ? (
          <>
            <div className="flex flex-wrap justify-center transition duration-300 ease-in-out transform hover:scale-105">
              <Card
                className=" transition duration-300 ease-in-out transform hover:scale-105"
                icon={totalstd}
                title="Total Students"
                value={details?.studentsCount}
              />
              <Card
                icon={course}
                title="Listed Course"
                value={details?.coursesCount}
              />
              <Card
                icon={course}
                title="Unlisted Course"
                value={details?.totalUnlistedCourses}
              />
              {/* <Card icon={certificate} title="Certificate" value={0} /> */}
              <Card
                icon={revenue}
                title="Total Revenue"
                value={details?.totalIncome}
              />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-4 p-3 text-center">
              Recent Uploads
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
              {courses.map((course, i) => (
                <CourseCard key={i} course={course} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-2xl font-bold text-gray-800 mb-4 mt-4 p-3 text-center">
            No courses available. Create your first course now!
          </p>
        )}
        {/* <TeacherDashboardGraph /> */}
        <div
          className="flex flex-col md:flex-row bg-white rounded-lg shadow dark:bg-gray-900 m-4"
          style={cardStyle3}
        >
          <div className="w-full md:max-w-screen-xl mx-auto p-2 md:py-8">
            <div className="flex justify-between items-center flex-wrap">
              <span className="text-lg font-bold text-gray-700 ml-4 p-1">
                Ready to share your expertise with the world?
              </span>
              <button
                className="bg-gray-800 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded-md ml-7 mt-4 md:mt-0 hover:animate-shake"
                onClick={handleCourse}
              >
                ADD COURSE
              </button>
              <button
                className="bg-gray-800 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded-md ml-0 mt-4 md:mt-0 hover:animate-shake"
                onClick={handleRoom}
              >
                LIVE
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

const Card = ({ icon, title, value }) => (
  <a
    href="#"
    className="block max-w-sm p-6 rounded-lg shadow hover:bg-gray-100 dark:bg-gradient-to-r from-grad1 via-grad2 to-grad3 dark:border-gray-700 dark:hover:bg-gray-700 m-4 h-52 w-60"
  >
    <img src={icon} alt="Your Image" className="w-28 h-28 ml-10" />
    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
      {title}:{value}
    </h5>
    <p className="font-normal text-gray-700 dark:text-gray-400"></p>
  </a>
);

const CourseCard = ({ course }) => (
  <div className="w-full sm:w-1/2 md:w-1/3 lg:w-80 mx-2 rounded-md my-4 overflow-hidden hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105">
    <div className="flex justify-center pt-2">
      <p className="text-lg font-semibold text-gray-800 mb-2">{course.title}</p>
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
        <p className="text-lg font-bold text-orange-600">{`$${course.price}`}</p>
      </div>
    </div>
  </div>
);

export default ChefHome;
