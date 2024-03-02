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

const AddCourse = () => {
  const [demoVideo, setDemoVideo] = useState();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();
  const user = useSelector(auth);

  const [coverImage, setCoverImage] = useState(
    "https://thumbs.dreamstime.com/b/add-photo-simple-icon-image-thumbnail-sign-picture-placeholder-symbol-classic-flat-style-quality-design-element-simple-add-photo-220710759.jpg"
  );
  const token = useSelector(selectCurrentToken);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Course Name is required"),
    blurb: Yup.string().required("Blurb is required"),
    description: Yup.string().required("Description is required"),
    aboutChef: Yup.string().required("About Chef is required"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be a non-negative number"),
    coverImage: Yup.mixed()
      .required("Cover Image is required")
      .test(
        "fileType",
        "Invalid file type. Only support image formats.",
        (value) => !value || value.type.startsWith("image/")
      ),
    demoVideo: Yup.mixed()
      .required("Demo Video is required")
      .nullable() // Allow null as a valid value
      .test(
        "fileSize",
        "Demo Video file size is too large",
        (value) => !value || value.size <= 1024 * 1024 * 10 // 10 MB
      )
      .test(
        "fileType",
        "Invalid file type. Only support video formats.",
        (value) => !value || value.type.startsWith("video/")
      ),

    category: Yup.string().required("Category is required"),
  });

  const [values, setValues] = useState({
    title: "",
    blurb: "",
    description: "",
    aboutChef: "",
    price: "",
    category: "",
    user: user.id,
  });
  console.log(user);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: values,
    validationSchema: validationSchema,
    // onSubmit: handleSubmit, // You can uncomment this line if needed
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!demoVideo || !values || !coverImage) {
      // Using SweetAlert2 for a nice alert
      toast.error("Field Must Fill", {
        position: "top-right",
        duration: 3000,
        hideProgressBar: true,
        closeButton: true,
      });
      return;
    }

    const postData = {
      ...values,
      demoVideo,
      coverImage,
    };
    console.log("coverImage:", coverImage);
    console.log("demoVideo:", demoVideo);

    console.log(postData);

    try {
      if (
        postData.title &&
        postData.blurb &&
        postData.description &&
        postData.aboutChef &&
        postData.price &&
        postData.category
        // postData.coverImage
      ) {
        const loadingToastId = toast.loading(
          "Adding your course. Please wait..."
        );
        const response = await axiosPrivate.post("/chef/add-course", postData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response", response);
        toast.dismiss(loadingToastId);
        if (response.status === 201) {
          toast.success(response.data.message);
          setCoverImage(
            "https://thumbs.dreamstime.com/b/add-photo-simple-icon-image-thumbnail-sign-picture-placeholder-symbol-classic-flat-style-quality-design-element-simple-add-photo-220710759.jpg"
          );
          setDemoVideo(response.data.demoVideo);
          // Update the navigate call here
          navigate("/chef/my-course");
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error("Please fill in all required fields");
      }
    } catch (error) {
      console.log(error.message);
    }
    console.log("Form submitted!");
    // }
  };

  const handleValuesChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
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
                    ADD Course
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

export default AddCourse;

// import React, { useState, useEffect } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import ChefNavbar from "../../../component/Navbar/ChefNavbar";
// import toast, { Toaster } from "react-hot-toast";
// import { axiosPrivate } from "../../../api/axios";
// import { useSelector } from "react-redux";
// import { auth, selectCurrentToken } from "../../../context/authReducer";
// import { useNavigate, useLocation } from "react-router-dom";
// import Footer from "../../User/Footer/Footer";

// const validationSchema = Yup.object().shape({
//   title: Yup.string().required("Course Name is required"),
//   blurb: Yup.string().required("Blurb is required"),
//   description: Yup.string().required("Description is required"),
//   aboutChef: Yup.string().required("About Chef is required"),
//   price: Yup.number().required("Price is required"),
//   demoVideo: Yup.mixed()
//     .required("Demo Video is required")
//     .nullable()
//     .test(
//       "fileSize",
//       "Demo Video file size is too large",
//       (value) => !value || value.size <= 1024 * 1024 * 10 // 10 MB
//     )
//     .test(
//       "fileType",
//       "Invalid file type. Only support video formats.",
//       (value) => !value || value.type.startsWith("video/")
//     ),
//   category: Yup.string().required("Category is required"),
// });

// const AddCourse = () => {
//   const [demoVideo, setDemoVideo] = useState();
//   const navigate = useNavigate();
//   const user = useSelector(auth);
//   const location = useLocation();
//   const [coverImage, setCoverImage] = useState();
//   const token = useSelector(selectCurrentToken);

//   const isEditing = location.state?.isEditing;
//   const courseData = location.state?.courseData;

//   useEffect(() => {
//     if (isEditing && courseData) {
//       setCoverImage(
//         courseData.coverImage?.url ||
//           "https://thumbs.dreamstime.com/b/add-photo-simple-icon-image-thumbnail-sign-picture-placeholder-symbol-classic-flat-style-quality-design-element-simple-add-photo-220710759.jpg"
//       );
//       setDemoVideo(courseData.demoVideo?.url);
//     }
//   }, [isEditing, courseData]);

//   return (
//     <>
//       <div className="bg-gray-200">
//         <ChefNavbar />
//         <Formik
//           enableReinitialize={true}
//           initialValues={{
//             title: courseData?.title || "",
//             blurb: courseData?.blurb || "",
//             description: courseData?.description || "",
//             aboutChef: courseData?.aboutChef || "",
//             price: courseData?.price || "",
//             category: courseData?.category || "",
//             user: user.id,
//           }}
//           validationSchema={validationSchema}
//           onSubmit={async (values, { setSubmitting }) => {
//             setSubmitting(true);

//             if (isEditing && courseData) {
//               // Handle course update logic
//               const updatedCourseData = {
//                 title: values.title,
//                 blurb: values.blurb,
//                 description: values.description,
//                 aboutChef: values.aboutChef,
//                 price: values.price,
//                 category: values.category,
//                 user: user.id,
//               };

//               try {
//                 const loadingToastId = toast.loading(
//                   "Updating your course. Please wait..."
//                 );

//                 // Send a request to update the course data
//                 const response = await axiosPrivate.patch(
//                   `/chef/edit-course/${courseData._id}`,
//                   updatedCourseData,
//                   {
//                     headers: {
//                       "Content-Type": "application/json",
//                       Authorization: `Bearer ${token}`,
//                     },
//                   }
//                 );

//                 toast.dismiss(loadingToastId);

//                 if (response && response.status === 200) {
//                   toast.success(response.data.message);
//                   navigate("/chef/my-course");
//                 } else {
//                   toast.error(response?.data?.message || "An error occurred");
//                 }
//               } catch (error) {
//                 console.log(error.message);
//               }
//             } else {
//               if (!demoVideo || !values || !coverImage) {
//                 // Using SweetAlert2 for a nice alert
//                 toast.error("Field Must Fill", {
//                   position: "top-right",
//                   duration: 3000,
//                   hideProgressBar: true,
//                   closeButton: true,
//                 });
//                 setSubmitting(false);
//                 return;
//               }

//               const postData = {
//                 ...values,
//                 demoVideo,
//                 coverImage,
//               };

//               console.log(postData);

//               try {
//                 if (
//                   postData.title &&
//                   postData.blurb &&
//                   postData.description &&
//                   postData.aboutChef &&
//                   postData.price &&
//                   postData.category &&
//                   postData.coverImage
//                 ) {
//                   const loadingToastId = toast.loading(
//                     "Adding your course. Please wait..."
//                   );
//                   const response = await axiosPrivate.post(
//                     "/chef/add-course",
//                     postData,
//                     {
//                       headers: {
//                         "Content-Type": "multipart/form-data",
//                         Authorization: `Bearer ${token}`,
//                       },
//                     }
//                   );
//                   toast.dismiss(loadingToastId);
//                   if (response.status === 201) {
//                     toast.success(response.data.message);

//                     // Update the navigate call here
//                     navigate("/chef/my-course");
//                   } else {
//                     toast.error(response.data.message);
//                   }
//                 } else {
//                   toast.error("Please fill in all required fields");
//                 }
//               } catch (error) {
//                 console.log(error.message);
//               }
//               console.log("Form submitted!");
//             }

//             setSubmitting(false);
//           }}
//         >
//           <Form encType="multipart/form-data">
//             <div className="flex p-4">
//               {/* Left side: Add Thumbnail Card */}
//               <div
//                 className="w-1/2 p-4 bg-white rounded-lg shadow-md dark:bg-neutral-800"
//                 style={{
//                   background:
//                     "linear-gradient(to right, hsl(210, 40%, 95%), hsl(0, 40%, 95%), hsl(60, 100%, 95%))",
//                 }}
//               >
//                 <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-50">
//                   Add Thumbnail and Demo Video
//                 </h2>
//                 <div className="mb-4">
//                   {/* Thumbnail Section */}
//                   <h3 className="text-lg font-medium mb-2 text-neutral-800 dark:text-neutral-50">
//                     Thumbnail
//                   </h3>
//                   <img
//                     src={coverImage}
//                     alt="coverImage"
//                     className="w-full max-w-xs h-32 object-cover rounded-lg mb-2"
//                     style={{
//                       background:
//                         "linear-gradient(to right, hsl(210, 40%, 95%), hsl(0, 40%, 95%), hsl(60, 100%, 95%))",
//                     }}
//                   />
//                   <Field
//                     type="file"
//                     name="coverImage"
//                     accept="image/*"
//                     onChange={(e) => setCoverImage(e.target.files[0])}
//                     className="bg-black text-white py-2 px-4 rounded w-full mb-4"
//                   />

//                   {/* Demo Video Section */}
//                   <h3 className="text-lg font-medium mb-2 text-neutral-800 dark:text-neutral-50">
//                     Demo Video
//                   </h3>
//                   <video
//                     controls
//                     src={demoVideo}
//                     className="w-full max-w-xs h-32 object-cover rounded-lg mb-2"
//                   ></video>
//                   <Field
//                     type="file"
//                     name="demoVideo"
//                     accept="video/*"
//                     onChange={(e) => setDemoVideo(e.target.files[0])}
//                     className="bg-black text-white py-2 px-4 rounded w-full"
//                   />
//                   <ErrorMessage
//                     name="demoVideo"
//                     component="div"
//                     className="text-red-500 text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Right side: Input Fields */}
//               <div className="w-1/2 p-4">
//                 <div className="mb-6">
//                   <label
//                     htmlFor="title"
//                     className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                   >
//                     Course Name
//                   </label>
//                   <Field
//                     type="text"
//                     id="title"
//                     name="title"
//                     className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   />
//                   <ErrorMessage
//                     name="title"
//                     component="div"
//                     className="text-red-500 text-sm"
//                   />
//                 </div>

//                 <div className="mb-6">
//                   <label
//                     htmlFor="blurb"
//                     className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                   >
//                     Blurb
//                   </label>
//                   <Field
//                     type="text"
//                     id="blurb"
//                     name="blurb"
//                     className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   />
//                   <ErrorMessage
//                     name="blurb"
//                     component="div"
//                     className="text-red-500 text-sm"
//                   />
//                 </div>

//                 <div className="mb-6">
//                   <label
//                     htmlFor="description"
//                     className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                   >
//                     Description
//                   </label>
//                   <Field
//                     as="textarea"
//                     id="description"
//                     rows="4"
//                     name="description"
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 resize-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   />
//                   <ErrorMessage
//                     name="description"
//                     component="div"
//                     className="text-red-500 text-sm"
//                   />
//                 </div>

//                 <div className="mb-6">
//                   <label
//                     htmlFor="aboutChef"
//                     className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                   >
//                     About Chef
//                   </label>
//                   <Field
//                     type="text"
//                     id="aboutChef"
//                     name="aboutChef"
//                     className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   />
//                   <ErrorMessage
//                     name="aboutChef"
//                     component="div"
//                     className="text-red-500 text-sm"
//                   />
//                 </div>

//                 <div className="mb-6">
//                   <label
//                     htmlFor="price"
//                     className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                   >
//                     Price
//                   </label>
//                   <Field
//                     type="number"
//                     id="price"
//                     name="price"
//                     className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   />
//                   <ErrorMessage
//                     name="price"
//                     component="div"
//                     className="text-red-500 text-sm"
//                   />
//                 </div>

//                 <div className="mb-6">
//                   <label
//                     htmlFor="category"
//                     className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                   >
//                     Category
//                   </label>
//                   <Field
//                     type="text"
//                     id="category"
//                     name="category"
//                     className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   />
//                   <ErrorMessage
//                     name="category"
//                     component="div"
//                     className="text-red-500 text-sm"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
//                 >
//                   {isEditing ? "Update Course" : "ADD Course"}
//                 </button>
//               </div>
//               <Toaster />
//             </div>
//           </Form>
//         </Formik>
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default AddCourse;
