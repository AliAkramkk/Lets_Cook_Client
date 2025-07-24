import React, { useState, useEffect } from "react";
import UserNavbar from "../../../component/Navbar/UserNavbar";
import Footer from "../Footer/Footer";
import HomeCard from "../../../component/Card/HomeCard";
import myImage from "../../../assets/Lets cook/network.png";
import { auth, selectCurrentToken } from "../../../context/authReducer";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios, { axiosPrivate } from "../../../api/axios";
import { motion } from "framer-motion";
import AdminNavbar from "../../../component/Navbar/AdminNavbar";
import ChefNavbar from "../../../component/Navbar/ChefNavbar";
import "../../../component/Navbar/UserNavbarStyle.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cb from "../../../assets/Lets cook/cb.jpeg"
import hoverCb  from "../../../assets/Lets cook/cb making.jpeg"
import cake from "../../../assets/Lets cook/cake.jpeg"
import hovercake from "../../../assets/Lets cook/hovercake.jpeg"
import butterchicken from "../../../assets/Lets cook/butterchicken.jpeg"
import fc from "../../../assets/Lets cook/fc.jpeg"

import BlogCard from "../../../component/User/BlogCard";
import TestimonialCard from "../../../component/Card/Reviewcard";
import Reviewcard from "../../../component/Card/Reviewcard";
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState(null);
  const [reviews, setReviews] = useState([]);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axiosPrivate.get("/reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
            // Add any other headers if needed
          },
        });
        console.log("res data", response.data.reviews);
        setReviews(response.data.reviews);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchReview();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setCategories(response?.data?.category.slice(0, 4));
        console.log("categories", response?.data?.category.slice(0, 4));
      } catch (error) {
        console.log();
      }
    };
    fetchData();
  }, []);

  // ...............blogFetching.........................
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosPrivate.get("/blogs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("blog res", response.data.results);
        setBlogs(response.data.results);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchBlog();
  }, []);

  // ......blog slider settings......

  const settings = {
    // dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncatedDescription = blogs?.description?.slice(0, 100);

 
  const cardStyle3 = {
    background:
      "linear-gradient(to right, hsl(210, 60%, 95%), hsl(0, 60%, 95%), hsl(60, 100%, 95%))",
  };
  return (
    <>
      <div className=" bg-gray-100 ">
        {user.role == 1000 ? (
          <AdminNavbar />
        ) : user.role == 3000 ? (
          <ChefNavbar />
        ) : (
          <UserNavbar />
        )}

        <HomeCard />

        <h4 className="text-xl font-mono text-gray-800 mb-4 mt-4 text-center">
          Variety of Category to Excel
        </h4>
        {/* <div className="grid p-4 grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6 z-10 relative bg-gray-100 ">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="feature text-center p-b-6 bg-gray-200 rounded-lg border-b "
              onClick={() =>
                navigate("/all-courses", { state: { category: category.name } })
              }
            >
              <img
                src={category.image.url}
                className="w-full h-60  object-cover mb-4 "
                style={{ objectPosition: "bottom" }}
              />
              <h3 className="text-xl font-semibold mb-2 ">{category.name}</h3>
            </motion.div>
          ))}
        </div> */}
        <div className="flex md:flex-row flex-row-2 m-8 items-center justify-center gap-6 ">
          <div className="relative rounded-3xl overflow-hidden w-24 h-24 md:w-64 md:h-56 mx-auto mb-2 hover:scale-105 transition-transform border hover:border-amber-300 group">
               <img src={cb} alt="Biriyani" className=" group-hover:opacity-0" />
    <img src={hoverCb} alt="Biriyani Hover" className="object-cover  absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
            <h1 className="font-thin text-center p-3">Malabar Chicken Biriyani</h1>
          </div>
          <div className="relative rounded-3xl overflow-hidden w-24 h-24 md:w-64 md:h-56 mx-auto mb-2 hover:scale-105 transition-transform border hover:border-amber-300 group">
            <img src={cake} alt="" className="object-cover"/>
             <img src={hovercake} alt="Biriyani Hover" className="object-cover  absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
            <h1 className="font-thin text-center p-3">Home Made Cake</h1>
          </div>
          <div className="rounded-3xl overflow-hidden w-24 h-24 md:w-64 md:h-56 mx-auto mb-2 hover:scale-105 transition-transform border hover:border-amber-300">
            <img src={butterchicken} alt="" className="object-cover"/>
            <h1 className="font-thin text-center p-3">Butter Chicken</h1>
          </div>
          <div className="rounded-3xl overflow-hidden w-24 h-24 md:w-64 md:h-56 mx-auto mb-2 hover:scale-105 transition-transform border hover:border-amber-300">
            <img src={fc} alt="" className="object-cover"/>
            <h1 className="font-thin text-center p-3">Fried Chicke</h1>
          </div>
          {/* <div className="rounded-3xl overflow-hidden w-24 h-24 md:w-64 md:h-56 mx-auto mb-2 hover:scale-105 transition-transform border hover:border-amber-300">
            <img src={cb} alt="" className="object-cover"/>
            <h1 className="font-thin text-center p-3">Malabar Chicken Biriyani</h1>
          </div> */}
        </div>
        {/* <Slider {...settings}> */}
        <div
          className="bg-white rounded-lg shadow dark:bg-gray-900 m-4"
          style={cardStyle3}
        >
          <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <h1 className="text-2xl font-mono text-gray-800 mb-4 mt-2">
                Experience the Live video
                <br />
                Call with the Chef
                <br />
                <span className="text-xs font-light text-gray-700 ml-4 ">
                  "OUR PLATFORM FACILITATES DIRECT COMMUNICATION BETWEEN USERS
                  AND TUTORS.COLLOBORATE,CONNECT <br />
                  AND SHOW CASE YOUR SKILLS WITH ENGAGE TO DO CAREER AND
                  IMPLIMENT NEW IDEA"
                </span>
              </h1>

              <img
                src={myImage}
                alt="Your Image"
                className="w-80 h-72  transition duration-300 ease-in-out transform hover:scale-105"
              />
            </div>
            {/* <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md ml-7 mt-6 "
              // onClick={handleCourse}
            >
              EXPLORE COURSE
            </button> */}
          </div>
        </div>
        {/* </Slider> */}
        <h4 className="text-xl font-bold text-gray-800 mb-4 mt-4 text-center">
          Popular Blogs
        </h4>
        {/* <Slider {...settings}>
          {blogs && blogs.length !== 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="flex justify-center">
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-80 bg-gray-200 mx-2 rounded-md my-4 overflow-hidden hover:bg-gray-300 ">
                  <div className=" pt-2">
                    <p className="text-lg font-semibold text-gray-800 mb-2"></p>
                  </div>
                  <Link>
                    <img
                      className="w-full h-56 object-cover px-4 transition duration-300 ease-in-out transform hover:scale-150"
                      style={{ objectFit: "cover" }}
                      src={blog.coverImage.url}
                      alt=""
                    />
                  </Link>
                  <div className="p-5">
                    <div className="flex">
                      <Link>
                        <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">
                          {blog.title}
                        </h5>
                      </Link>
                    </div>
                    <p className="font-normal text-gray-700 mb-3">
                      {blog.description}
                    </p>
                    <p className="text-gray-500 font-bold text-xs tracking-tight mb-2 text-end">
                      From: {blog.user.username}
                    </p>
                    {/* <button
                      className="text-white bg-gray-700 hover:bg-gray-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
                      // onClick={() =>
                      //   navigate("/user/blogDetails", {
                      //     state: { blogId: blog._id, prevLocation: location },
                      //   })
                      // }
                    >
                      Blog Details
                    </button> */}
                  {/* </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-40 w-full flex justify-center items-center">
              <div className="text-black text-4xl capitalize font-bold text-center">
                not found anything<span className="text-red-500">!</span>
              </div>
            </div>
          )}
        </Slider> */} 

         {/* <div className="flex md:flex-row m-8 items-center justify-center gap-6 ">
          <div className="rounded-3xl overflow-hidden w-24 h-24 md:w-64 md:h-56 mx-auto mb-2 hover:scale-105 transition-transform border hover:border-amber-300">
            <img src={cb} alt="" className="object-cover"/>
            <h1 className="font-thin">Malabar Chicken Biriyani</h1>
          </div>
          <div className="rounded-3xl overflow-hidden w-24 h-24 md:w-64 md:h-56 mx-auto mb-2 hover:scale-105 transition-transform border hover:border-amber-300">
            <img src={cb} alt="" className="object-cover"/>
            <h1 className="font-thin">Malabar Chicken Biriyani</h1>
          </div>
          <div className="rounded-3xl overflow-hidden w-24 h-24 md:w-64 md:h-56 mx-auto mb-2 hover:scale-105 transition-transform border hover:border-amber-300">
            <img src={cb} alt="" className="object-cover"/>
            <h1 className="font-thin">Malabar Chicken Biriyani</h1>
          </div>
          <div className="rounded-3xl overflow-hidden w-24 h-24 md:w-64 md:h-56 mx-auto mb-2 hover:scale-105 transition-transform border hover:border-amber-300">
            <img src={cb} alt="" className="object-cover"/>
            <h1 className="font-thin">Malabar Chicken Biriyani</h1>
          </div>
          <div className="rounded-3xl overflow-hidden w-24 h-24 md:w-64 md:h-56 mx-auto mb-2 hover:scale-105 transition-transform border hover:border-amber-300">
            <img src={cb} alt="" className="object-cover"/>
            <h1 className="font-thin">Malabar Chicken Biriyani</h1>
          </div>
        </div> */}
        {/* <div className="m-5 flex justify-center">
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((review) => (
              <Reviewcard
                key={review.date}
                review={review}
                coverImage={review.coverImage.url}
              />
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div> */}
        <Footer />
      </div>
    </>
  );
};

export default Home;
