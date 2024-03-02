import React, { useEffect, useState } from "react";
import UserNavbar from "../../../component/Navbar/UserNavbar";
import Rating from "@mui/material/Rating";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../../../context/authReducer";
import { axiosPrivate } from "../../../api/axios";
import Footer from "../Footer/Footer";
const VideoSection = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const [currentVideo, setCurrentVideo] = useState({});
  const [courseTitle, setCourseTitle] = useState("");
  const [chapters, setChapters] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [isReviewAdded, setIsReviewAdded] = useState(false);
  const location = useLocation();
  const course_id = location?.state?.course_id;
  const [value, setValue] = useState({
    rating: null,
    review: null,
    user: user,
    course_id: course_id,
  });
  const [completedChapters, setCompletedChapters] = useState(() => {
    // Load completed chapters from localStorage or an initial value
    const storedChapters = localStorage.getItem("completedChapters");
    return storedChapters ? JSON.parse(storedChapters) : [];
  });

  const handleChapterCompletion = (completedChapterId) => {
    setCompletedChapters((prevChapters) => {
      const updatedChapters = [...prevChapters, completedChapterId];
      localStorage.setItem(
        "completedChapters",
        JSON.stringify(updatedChapters)
      );
      return updatedChapters;
    });
  };

  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const submitReview = async () => {
    if (value.rating == null) {
      return console.log("please give rating");
    }
    if (value.review == null) {
      return console.log("please give review");
    }

    try {
      const respons = await axiosPrivate.post("/user/addReview", value, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Add any other headers if needed
        },
      });
      setIsReviewAdded(true);
      console.log(respons.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosPrivate.get(
          `/user/getCurrentCourse/${course_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Add any other headers if needed
            },
          }
        );
        console.log("response", response.data.course);
        console.log("video", currentVideo?.demoVideo?.url);

        setCourseTitle(response.data.course.title);
        setChapters(response.data.course.chapters);
        // setReviews(response.data.course.reviews);
        const reversedReviews = [...response.data.course.reviews].reverse();
        setReviews(reversedReviews);

        setCurrentVideo({
          ...response.data.course.chapters[0],
          coverImage: response.data.course.coverImage,
          demoVideo: response.data.course.demoVideo,
          title: response.data.course.title,
          description: response.data.course.description,
        });

        const isReviewed = response.data.course.reviews.some(
          (review) => review.user === user
        );
        setIsReviewAdded(isReviewed);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchCourse();
  }, [course_id, isReviewAdded]);

  const truncatedDescription = currentVideo?.description?.slice(0, 100);
  return (
    <>
      <div className="bg-gray-200">
        <UserNavbar />
        <div className="ms-2 me-2 mt-8 flex flex-col md:flex-row">
          {/* Video Player Section */}
          <div className="w-full md:w-3/4 md:px-12 mb:pr-4">
            <div className="text-center mb-2">
              <h2 className="text-3xl font-bold text-black-600">
                {courseTitle}
              </h2>
            </div>
            <div className="bg-white p-4 rounded-md border shadow-md">
              <video
                controls
                src={currentVideo?.demoVideo?.url}
                className="w-full h-[240px] md:h-[480px] object-cover rounded-md mb-4"
                poster={currentVideo?.coverImage?.url}
                autoPlay
                muted
              />

              {/* <ReactPlayer
        url={currentVideo?.demoVideo?.url}
        controls={true}
        width="800px"
        height='450px'
        /> */}
              {/* <ReactPlayer
                url={currentVideo?.demoVideo?.url}
                controls={true}
                width="100%"
                height="100%"
              /> */}
              <div className="mt-2 overflow-y-hidden ">
                <h2 className="text-lg font-semibold">{currentVideo?.title}</h2>
                <p className="text-md">
                  {showFullDescription
                    ? currentVideo?.description
                    : truncatedDescription}
                  {!showFullDescription &&
                    truncatedDescription?.length >= 100 && (
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
              </div>
            </div>
            <div className="hidden md:block">
              {!isReviewAdded && (
                <div className="my-8 max-w-lg  p-6 bg-white rounded-md shadow-md">
                  <h2 className="text-xl mb-4 text-center">Rate & Review</h2>

                  {/* Rating Stars */}
                  <div className="mb-6 text-center">
                    <p className="text-lg mb-2">Rate this product:</p>
                    <Rating
                      name="product-rating"
                      value={value.rating}
                      onChange={(event, newValue) => {
                        setValue({ ...value, rating: newValue });
                      }}
                    />
                  </div>

                  {/* Review Textarea */}
                  <textarea
                    className="w-full p-2 mb-4 border rounded-md"
                    placeholder="Write your review here..."
                    rows={4}
                    onChange={(event) => {
                      // setReviewText(event.target.value);
                      setValue({ ...value, review: event.target.value });
                    }}
                  ></textarea>

                  {/* Submit Button */}
                  <button
                    className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                    onClick={submitReview}
                  >
                    Submit Review
                  </button>
                </div>
              )}
              <div className="max-w-xl my-8 p-6 bg-white rounded-md shadow-md">
                <h2 className="text-2xl mb-6 text-center">Product Reviews</h2>

                {/* Single Review Card (Sample) */}
                {reviews.map((review) => (
                  <div className="border-b pb-4 mb-4">
                    {/* Username and Date */}
                    <div className="flex justify-between mb-2">
                      <span className="font-bold">{review.user}</span>
                      <span className="text-sm text-gray-500">
                        {review.date?.slice(0, 10)}
                      </span>
                    </div>

                    {/* Rating Stars */}
                    <div className="mb-2">
                      <Rating name="read-only" value={review.rating} readOnly />
                      <span className="ml-2 text-md text-gray-500">
                        {review.rating}.0
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 mb-4">{review.review}</p>
                  </div>
                ))}

                {/* Add more review cards as needed... */}
              </div>
            </div>
          </div>

          <div className="md:w-1/4 w-full md:p-4 md:ps-0">
            <h2 className="text-2xl mt-8 md:mt-0 font-bold mb-4">
              Full Chapters
            </h2>
            {/* {chapters.map((chapter, i) => (
              <div
                key={i}
                onClick={() => setCurrentVideo(chapter)}
                className={`w-full  ${
                  currentVideo.id === chapter.id
                    ? "bg-blue-200 md:scale-105 shadow-lg"
                    : "bg-white "
                } mt-1 border border-gray-300 cursor-pointer h-24 overflow-hidden rounded p-2 flex flex-row items-center`}
              >
                {/* <video
                poster={chapter.coverImage.url}
                controls
                className="w-1/3 h-full min-w-[110px] rounded-md  mb-4 md:mb-0"
              /> */}

            {/* <img
                  src={chapter.coverImage.url}
                  alt="video"
                  className="w-1/4 h-full min-w-[70px] rounded-md  mb-4 md:mb-0"
                />

                <div className="md:ms-4 flex-1">
                  <h1 className="font-semibold  my-1">{chapter.title}</h1>
                  <p className="text-sm text-gray-600 h-12 overflow-hidden  leading-4 mb-2">
                    {chapter.description}
                  </p>
                </div>
              </div>  ))}*/}

            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => {
                  const isCompleted = completedChapters.includes(chapter.id);
                  if (isCompleted) {
                    setCurrentVideo(chapter);
                  } else {
                    toast.error("Complete the previous chapter first.");
                  }
                }}
                className={`w-full ${
                  currentVideo.id === chapter.id
                    ? "bg-blue-200 md:scale-105 shadow-lg"
                    : completedChapters.includes(chapter.id)
                    ? "bg-green-200" // Change background color for completed chapters
                    : "bg-white "
                } mt-1 border border-gray-300 cursor-pointer h-24 overflow-hidden rounded p-2 flex flex-row items-center`}
              >
                <img
                  src={chapter.coverImage.url}
                  alt="video"
                  className="w-1/4 h-full min-w-[70px] rounded-md mb-4 md:mb-0"
                />

                <div className="md:ms-4 flex-1">
                  <h1 className="font-semibold  my-1">{chapter.title}</h1>
                  <p className="text-sm text-gray-600 h-12 overflow-hidden leading-4 mb-2">
                    {chapter.description}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the chapter div from being clicked when the button is clicked
                    handleChapterCompletion(chapter.id);
                  }}
                  className={`${
                    completedChapters.includes(chapter.id)
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }  text-white py-2 px-4 rounded-md`}
                >
                  {completedChapters.includes(chapter.id)
                    ? "completed"
                    : "pending"}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="block md:hidden">
          {!isReviewAdded && (
            <div className="my-8 max-w-lg  p-6 bg-white rounded-md shadow-md">
              <h2 className="text-xl mb-4 text-center">Rate & Review</h2>

              {/* Rating Stars */}
              <div className="mb-6 text-center">
                <p className="text-lg mb-2">Rate this product:</p>
                <Rating
                  name="product-rating"
                  value={value.rating}
                  onChange={(event, newValue) => {
                    setValue({ ...value, rating: newValue });
                  }}
                />
              </div>

              {/* Review Textarea */}
              <textarea
                className="w-full p-2 mb-4 border rounded-md"
                placeholder="Write your review here..."
                rows={4}
                onChange={(event) => {
                  // setReviewText(event.target.value);
                  setValue({ ...value, review: event.target.value });
                }}
              ></textarea>

              {/* Submit Button */}
              <button
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                onClick={submitReview}
              >
                Submit Review
              </button>
            </div>
          )}
          <div className="max-w-xl my-8 p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl mb-6 text-center">Product Reviews</h2>

            {/* Single Review Card (Sample) */}
            {reviews.map((review) => (
              <div className="border-b pb-4 mb-4">
                {/* Username and Date */}
                <div className="flex justify-between mb-2">
                  <span className="font-bold">{review.user}</span>
                  <span className="text-sm text-gray-500">
                    {review.date?.slice(0, 10)}
                  </span>
                </div>

                {/* Rating Stars */}
                <div className="mb-2">
                  <Rating name="read-only" value={review.rating} readOnly />
                  <span className="ml-2 text-md text-gray-500">
                    {review.rating}.0
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-4">{review.review}</p>
              </div>
            ))}

            {/* Add more review cards as needed... */}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default VideoSection;
