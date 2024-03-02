import React, { useEffect, useState } from "react";
import UserNavbar from "../../../component/Navbar/UserNavbar";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../../api/axios";
import Footer from "../Footer/Footer";
import { loadStripe } from "@stripe/stripe-js";
import { auth, selectCurrentToken } from "../../../context/authReducer";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Rating } from "@mui/material";
import "../../../component/Navbar/UserNavbarStyle.css";

const CourseDetails = () => {
  const cardStyle3 = {
    background:
      "linear-gradient(to right, hsl(210, 40%, 95%), hsl(0, 40%, 95%), hsl(60, 100%, 95%))",
  };
  const cardStyle4 = {
    background:
      "linear-gradient(to right, hsl(210, 30%, 95%), hsl(0, 30%, 95%), hsl(60, 100%, 95%))",
  };
  const location = useLocation();
  const [videoVisible, setVideoVisible] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const mycourse_id = location.state?.id;
  const user = useSelector(auth);
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosPrivate.get(
          `/selectedCourse/${mycourse_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Add any other headers if needed
            },
          }
        );
        console.log("response", response.data.course);
        setCourseData(response.data.course);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchCourse();
  }, [mycourse_id]);

  const makePayment = async () => {
    try {
      if (!user.user) {
        console.log(user);
        return navigate("/signin", {
          state: { from: location, id: mycourse_id },
        });
        // console.log(state);
      }
      const stripe = await loadStripe(
        "pk_test_51OISQWSBQLVhDmRfAhLKSBBKcyKeeIUvfUe1urrofu6ZeWJqqY5N6pVwJ7ItTIVpPSm1kAAWuuR5WJmQMfFUCn6800Wi7hSBjG"
      );
      const response = await axiosPrivate.post(
        "/user/makePayment",
        {
          courseData,
          user,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Add any other headers if needed
          },
        }
      );
      console.log(response);

      const result = stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (result.error) {
        console.error(result.error);
        // Handle the error, e.g., show an error message to the user
      } else {
        // The redirection was successful
        console.log("Redirection successful");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleImageClick = () => {
    setVideoVisible(true);
  };

  const handleVideoClose = () => {
    setVideoVisible(false);
  };
  return (
    <>
      <UserNavbar />
      <Toaster />
      {/* <p>Hash: {location.state}</p> */}
      <div className="flex flex-col md:flex-row bg-gray-100">
        <div className="flex-1 text-left p-6">
          <h2 className="text-sm md:text-2xl font-bold text-gray-800 mb-4 mt-4 ml-4">
            {courseData.title}
          </h2>
          <h4 className="text-lg font-bold text-gray-800 mb-4 mt-4 ml-4">
            {courseData.title} - Chef Chrstepher
          </h4>
          <p className="ml-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat
          </p>
          <div
            className="bg-white rounded-lg shadow dark:bg-gray-900 m-4"
            style={cardStyle3}
          >
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
              <div className="sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  About:
                  <br />
                </h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Incepted with
                  a vision and fueled by passion, our story unfolds amidst the
                  dynamic landscape of possibilities. Lorem ipsum dolor sit amet
                </p>
                {/* <img src={myImage} alt="Your Image" className="w-64 h-48" /> */}
              </div>
            </div>
          </div>

          <div className="font-medium text-lg mb-4 mt-8 md:mt-0">
            What People have to say
          </div>
          {courseData.reviews && courseData.reviews.length > 0 ? (
            courseData.reviews.map((review, i) => (
              <div key={i} className="p-5 mb-3">
                <article className="p-6 text-base bg-gray-100 rounded-xl mb-3">
                  <footer className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <p className="inline-flex items-center mr-3 text-sm text-gray-700 font-semibold">
                        <img
                          className="mr-2 w-6 h-6 rounded-full"
                          src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                          alt="Profile"
                        />
                        {review?.user}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <time>
                          {new Date(review?.date).toLocaleDateString("en-GB")}
                        </time>
                      </p>
                    </div>
                  </footer>
                  <Rating name="rating" value={review?.rating} readOnly />
                  <p className="text-gray-500">{review?.review}</p>
                </article>
              </div>
            ))
          ) : (
            <article className="p-5 text-base bg-white rounded-lg mb-3">
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center"></div>
              </footer>
              <p className="text-orange-400 text-xl font-semibold">
                Be the first to Review the Course
              </p>
            </article>
          )}
        </div>
        <div className="flex-1 md:p-6">
          <Card
            className="w-full md:w-96 h-auto mt-8 md:mt-0 md:ml-4 md:p-4"
            style={cardStyle4}
          >
            <CardHeader shadow={false} floated={false} className="h-96">
              {videoVisible ? (
                <video
                  controls
                  src={courseData?.demoVideo?.url}
                  className="h-48 w-full object-cover md:h-full md:w-auto"
                  onClick={handleVideoClose}
                />
              ) : (
                <img
                  src={courseData?.coverImage?.url}
                  alt="card-image"
                  className="h-48 w-full object-cover cursor-pointer md:h-full md:w-auto"
                  onClick={handleImageClick}
                />
              )}
            </CardHeader>
            <CardBody>
              <div className="mb-2 flex items-center justify-between">
                <Typography color="blue-gray" className="font-medium">
                  {courseData.title}
                </Typography>
                <Typography color="blue-gray" className="font-medium">
                  {courseData.price ? `$${courseData.price.toFixed(2)}` : ""}
                </Typography>
              </div>
              <Typography
                variant="small"
                color="gray"
                className="font-normal opacity-75"
              >
                {courseData.description}
              </Typography>
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                onClick={makePayment}
                ripple={false}
                fullWidth={true}
                className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100 hover:animate-shake hover:bg-slate-200"
              >
                BUY NOW
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;
