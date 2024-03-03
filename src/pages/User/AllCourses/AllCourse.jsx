import React, { useState, useEffect } from "react";
import { Spin as Hamburger } from "hamburger-react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BiSearchAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentId } from "../../../context/authReducer";
import UserNavbar from "../../../component/Navbar/UserNavbar";
import { axiosPrivate } from "../../../api/axios";
import Footer from "../Footer/Footer";
import "../../../component/Navbar/UserNavbarStyle.css";

const AllCourse = () => {
  const [courses, setCourses] = useState([]);
  const id = useSelector(selectCurrentId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/courses");
        console.log(response.data.course);
        setCourses(response.data.course);
      } catch (error) {
        // Handle errors, if necessary
      }
    };

    fetchData();
  }, []);

  const [filter, setFilter] = useState({
    chef: "",
    category: "",
    maxPrice: Infinity,
    minPrice: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const usenavigate = useNavigate();

  const handleFilterChange = (filterName, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [filterName]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesChef = filter.chef ? course.chef === filter.chef : true;
    const matchesCategory = filter.category
      ? course.category === filter.category
      : true;
    const matchesMinPrice = course.price >= filter.minPrice;
    const matchesMaxPrice = course.price <= filter.maxPrice;
    return matchesChef && matchesCategory && matchesMaxPrice && matchesMinPrice;
  });

  const searchedCourses = filteredCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
  const currentCourses = searchedCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const cardStyle3 = {
    background:
      "linear-gradient(to right, hsl(210, 60%, 95%), hsl(0, 60%, 95%), hsl(60, 100%, 95%))",
  };
  const cardStyle1 = {
    background:
      "linear-gradient(to right, rgb(235, 245, 255), rgb(255, 235, 235), rgb(255, 255, 225))",
  };

  return (
    <>
      <UserNavbar />

      <div className="w-full lg:hidden bg-gray-100 ">
        <div className="flex mt-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-transparent border h-14 me-8  items-center p-1 md:p-4  md:mt-2 shadow-lg rounded-lg flex  justify-center"
          >
            {/* <Hamburger size={20} direction="right" /> */}
          </button>
          <div className="bg-[#e4f7f1] border h-14 me-8 w-full md:p-4 p-2 mb-2 md:mt-2 shadow-lg rounded-lg flex justify-between sm:me-10 m-0">
            <input
              className="bg-[#e4f7f1] placeholder-gray-400 w-full text-sm outline-none focus:outline-none"
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ color: "black" }}
            />
            <BiSearchAlt size={30} />
          </div>
        </div>
      </div>

      <div className=" p-4 font-serif bg-gray-100">
        <div className="text-center mt-8 mb-8">
          <h2 className="text-3xl font-bold text-black-600">ALL COURSES</h2>
        </div>

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
                  <p className="text-lg font-bold text-orange-600">
                    ${course.price}
                  </p>
                  {!course.users.includes(id) ? (
                    <button
                      onClick={() =>
                        usenavigate("/coursedetails", {
                          state: { id: course._id },
                        })
                      }
                      className="btn hvr-shutter-in-horizontal justify-center  rounded-md border-black text-black  px-4 py-2 hover:bg-slate-200 transition duration-300 ease-in-out hover:animate-shake"
                    >
                      Enroll now
                      {/* <FontAwesomeIcon icon={faArrowRight} className="ml-2" /> */}
                    </button>
                  ) : (
                    <button
                      onClick={() => usenavigate("/user/my-learning", {})}
                      className="btn hvr-shutter-in-horizontal justify-center border-y rounded-md border-black text-black  px-4 py-2 hover:bg-indigo-800 transition duration-300 ease-in-out"
                    >
                      Watch now
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </button>
                  )}
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

export default AllCourse;
