import React, { useState, useEffect } from "react";
import ChefNavbar from "../../../component/Navbar/ChefNavbar";
import toast, { Toaster } from "react-hot-toast";
import { axiosPrivate } from "../../../api/axios";
import { useSelector } from "react-redux";
import { auth, selectCurrentToken } from "../../../context/authReducer";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import Footer from "../../User/Footer/Footer";

const EditCourse = () => {
  const [demoVideo, setDemoVideo] = useState();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();
  const user = useSelector(auth);
  const [coverImage, setCoverImage] = useState(null);
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const courseId = location.state ? location.state.courseID : null;
  console.log(courseId);
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Course Name is required"),
    blurb: Yup.string().required("Blurb is required"),
    description: Yup.string().required("Description is required"),
    aboutChef: Yup.string().required("About Chef is required"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be a non-negative number"),

    category: Yup.string().required("Category is required"),
  });

  const [values, setValues] = useState({
    title: "",
    blurb: "",
    description: "",
    aboutChef: "",
    price: 0,
    category: "",
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosPrivate.get(`/chef/getcourse/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const courseDataFromBackend = response.data.course;
        console.log("course", courseDataFromBackend); // Adjust the property based on your actual API response
        console.log("tittle", courseDataFromBackend.title);
        // Update the form values with the data from the backend
        setValues({
          title: courseDataFromBackend.title || "",
          blurb: courseDataFromBackend.blurb || "",
          description: courseDataFromBackend.description || "",
          aboutChef: courseDataFromBackend.aboutChef || "",
          price: courseDataFromBackend.price || 0,
          category: courseDataFromBackend.category || "",
          // Add more fields as needed
        });

        setCoverImage(courseDataFromBackend.coverImage?.url || null);
        setDemoVideo(courseDataFromBackend.demoVideo?.url || null);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchCourse();
  }, [courseId, token]);

  useEffect(() => {
    // Fetch existing categories from your API
    const fetchCategories = async () => {
      try {
        const response = await axiosPrivate.get("/chef/categories", {
          params: user,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Adjust the API endpoint accordingly
        console.log("response category", response.data);
        setCategories(response.data.categories);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setCoverImage(file);
    }
  };

  const handleDemoVideoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setDemoVideo(file);
    }
  };

  const handleValuesChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    if (selectedCategory === "new") {
      // If "new" is selected, set category in values and clear newCategory
      setValues({ ...values, category: selectedCategory, newCategory: "" });
    } else {
      // If an existing category is selected, set category in values and clear newCategory
      setValues({ ...values, category: selectedCategory });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedCourseData = new FormData();

    updatedCourseData.append("title", values.title);
    updatedCourseData.append("blurb", values.blurb);
    updatedCourseData.append("description", values.description);
    updatedCourseData.append("aboutChef", values.aboutChef);
    updatedCourseData.append("price", values.price);
    updatedCourseData.append("category", values.category);

    // Append coverImage if available
    // if (coverImage) {
    //   updatedCourseData.append(
    //     "coverImage",
    //     coverImage,
    //     coverImage.name || "default_coverImage_name"
    //   ); // Include the file name
    // }

    // // Append demoVideo if available
    // if (demoVideo) {
    //   updatedCourseData.append(
    //     "demoVideo",
    //     demoVideo,
    //     demoVideo.name || "default_demo_video_name"
    //   ); // Include the file name
    // }
    if (coverImage instanceof File) {
      updatedCourseData.append(
        "coverImage",
        coverImage,
        coverImage.name || "default_coverImage_name"
      ); // Include the file name
    }

    // Append demoVideo if available
    if (demoVideo instanceof File) {
      updatedCourseData.append(
        "demoVideo",
        demoVideo,
        demoVideo.name || "default_demo_video_name"
      ); // Include the file name
    }

    try {
      const loadingToastId = toast.loading(
        "Updating your course. Please wait..."
      );

      console.log("updatedCourseData", updatedCourseData);

      const response = await axiosPrivate.patch(
        `/chef/edit-course/${courseId}`,
        updatedCourseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss(loadingToastId);

      if (response && response.status === 200) {
        toast.success(response.data.message);
        navigate("/chef/my-course");
      } else {
        toast.error(response?.data?.message || "An error occurred");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const cardStyle4 = {
    background:
      "linear-gradient(to right, hsl(210, 40%, 95%), hsl(0, 40%, 95%), hsl(60, 100%, 95%))",
  };
  return (
    <>
      <div className=" bg-gray-200 ">
        <ChefNavbar />
        <Formik
          enableReinitialize
          initialValues={values}
          validationSchema={validationSchema}
          // onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form encType="multipart/form-data">
              <div className="flex p-4">
                {/* Left side: Add Thumbnail Card */}
                <div
                  className="w-1/2 p-4 bg-white rounded-lg shadow-md dark:bg-neutral-800"
                  style={cardStyle4}
                >
                  <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-50">
                    Add Thumbnail and Demo Video
                  </h2>
                  <div className="mb-4">
                    {/* Thumbnail Section */}
                    <h3 className="text-lg font-medium mb-2 text-neutral-800 dark:text-neutral-50">
                      Thumbnail
                    </h3>
                    <img
                      src={
                        coverImage instanceof File
                          ? URL.createObjectURL(coverImage)
                          : coverImage
                      }
                      alt="coverImage"
                      className="w-full max-w-xs h-32 object-cover rounded-lg mb-2"
                      style={cardStyle4}
                    />
                    <input
                      id="coverImage"
                      name="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="bg-black text-white py-2 px-4 rounded w-full mb-4"
                    />

                    {/* Demo Video Section */}
                    <h3 className="text-lg font-medium mb-2 text-neutral-800 dark:text-neutral-50">
                      Demo Video
                    </h3>
                    <video
                      controls
                      src={
                        demoVideo instanceof File
                          ? URL.createObjectURL(demoVideo)
                          : demoVideo
                      }
                      className="w-full max-w-xs h-32 object-cover rounded-lg mb-2"
                    ></video>
                    <input
                      id="demoVideo"
                      name="demoVideo"
                      type="file"
                      accept="video/*"
                      onChange={handleDemoVideoChange}
                      className="bg-black text-white py-2 px-4 rounded w-full"
                    />
                    <ErrorMessage
                      name="demoVideo"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                {/* Right side: Input Fields */}
                <div className="w-1/2 p-4">
                  <div className="mb-6">
                    <label
                      htmlFor="large-input"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Course Name
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      onChange={handleValuesChange}
                      value={values.title}
                      autoComplete="coursename"
                      className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="large-input"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Blurb
                    </label>
                    <input
                      type="text"
                      id="blurb"
                      name="blurb"
                      onChange={handleValuesChange}
                      value={formik.values.blurb}
                      autoComplete="blurb"
                      className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="blurb"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="default-input"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <input
                      as="textarea"
                      id="description"
                      rows="4"
                      onChange={handleValuesChange}
                      value={formik.values.description}
                      autoComplete="description"
                      name="description"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 resize-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="aboutChef"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      About Chef
                    </label>
                    <input
                      type="text"
                      id="aboutChef"
                      name="aboutChef"
                      onChange={handleValuesChange}
                      value={formik.values.aboutChef}
                      className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="aboutChef"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      onChange={handleValuesChange}
                      value={formik.values.price}
                      className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      onChange={handleCategoryChange}
                      value={values.category}
                      className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="" disabled>
                        Select a Category
                      </option>

                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}

                      <option value="new">Add New Category</option>
                    </select>
                    {values.category === "new" && (
                      <div className="mt-2">
                        <label
                          htmlFor="newCategory"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          New Category
                        </label>
                        <input
                          type="text"
                          id="newCategory"
                          name="newCategory"
                          onChange={handleValuesChange}
                          value={values.newCategory}
                          className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit(e, formik);
                    }}
                  >
                    Update Course
                  </button>
                </div>
                <Toaster />
              </div>
            </Form>
          )}
        </Formik>
        <Footer />
      </div>
    </>
  );
};

export default EditCourse;
