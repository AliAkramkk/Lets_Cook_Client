import React, { useState } from "react";
import ChefNavbar from "../../../component/Navbar/ChefNavbar";
import toast, { Toaster } from "react-hot-toast";
import { axiosPrivate } from "../../../api/axios";
import { useSelector } from "react-redux";
import { auth, selectCurrentToken } from "../../../context/authReducer";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Footer from "../../User/Footer/Footer";

function AddChapters() {
  const usenavigate = useNavigate();
  const [prevToastId, setPrevToastId] = useState(null);
  const user = useSelector(auth);
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const course_id = location.state?.id;

  const [coverImage, setCoverImage] = useState(
    "https://thumbs.dreamstime.com/b/add-photo-simple-icon-image-thumbnail-sign-picture-placeholder-symbol-classic-flat-style-quality-design-element-simple-add-photo-220710759.jpg"
  );
  const [demoVideo, setDemoVideo] = useState();

  const initialValues = {
    chapterNo: "",
    title: "",
    description: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .max(20, "Title must be at most 20 words"),
    description: Yup.string().required("Description is required"),
    coverImage: Yup.mixed().required("Cover Image is required"),
    demoVideo: Yup.mixed().required("Demo Video is required"),
    chapterNo: Yup.number()
      .required("chapterNo is required")
      .positive("chapterNo must be positive")
      .max(100, "maximum 100 chapters"),
  });

  const showToast = (message) => {
    if (prevToastId) {
      toast.dismiss(prevToastId);
    }

    const newToastId = toast.error(message, {
      duration: 3000,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        width: "300px",
      },
    });
    setPrevToastId(newToastId);
  };

  const handleSubmit = async (values) => {
    if (!demoVideo) {
      // Using SweetAlert2 for a nice alert
      // toast.error("Field Must Fill", {
      //   position: "top-right",
      //   duration: 3000,
      //   hideProgressBar: true,
      //   closeButton: true,
      // });
      // return;

      alert("Field Must fill");
      return;
    }
    try {
      // if (!demoVideo || !coverImage) {
      //   // Using SweetAlert2 for a nice alert
      //   toast.error("Field Must Fill", {
      //     position: "top-right",
      //     duration: 3000,
      //     hideProgressBar: true,
      //     closeButton: true,
      //   });
      //   return;
      // }
      const postData = {
        ...values,
        id: course_id,
        demoVideo,
        coverImage,
      };
      console.log("postData", postData);
      const loadingToastId = toast.loading(
        "Adding your course. Please wait..."
      );
      const response = await axiosPrivate.post("/chef/add-chapter", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.dismiss(loadingToastId);
      if (response.status === 201) {
        toast.success(response.data.message);
        console.log("Chapter Added Response:", response.data);
        const updatedResponse = await axiosPrivate.get(
          `/chef/getcourse/${course_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(updatedResponse.data.course);

        usenavigate(-1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log(error.response);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
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
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form encType="multipart/form-data">
              <div className="flex p-4">
                <div
                  className="w-1/2 p-4 bg-white rounded-lg shadow-md dark:bg-neutral-800"
                  style={cardStyle4}
                >
                  <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-50">
                    Add Thumbnail and Demo Video
                  </h2>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2 text-neutral-800 dark:text-neutral-50">
                      Thumbnail
                    </h3>
                    <img
                      // src={
                      //   coverImage instanceof File
                      //     ? URL.createObjectURL(coverImage)
                      //     : coverImage
                      // }
                      src="https://thumbs.dreamstime.com/b/add-photo-simple-icon-image-thumbnail-sign-picture-placeholder-symbol-classic-flat-style-quality-design-element-simple-add-photo-220710759.jpg"
                      alt="coverImage"
                      className="w-full max-w-xs h-32 object-cover rounded-lg mb-2"
                    />
                    <input
                      id="coverImage"
                      name="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setCoverImage(e.target.files[0]);
                        formik.setFieldValue("coverImage", e.target.files[0]);
                      }}
                      className="bg-black text-white py-2 px-4 rounded w-full mb-4"
                    />

                    <h3 className="text-lg font-medium mb-2 text-neutral-800 dark:text-neutral-50">
                      Demo Video
                    </h3>
                    <video
                      controls
                      // src={
                      //   demoVideo instanceof File
                      //     ? URL.createObjectURL(demoVideo)
                      //     : demoVideo
                      // }
                      src={demoVideo}
                      className="w-full max-w-xs h-32 object-cover rounded-lg mb-2"
                    ></video>
                    <input
                      id="demoVideo"
                      name="demoVideo"
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        setDemoVideo(e.target.files[0]);
                        formik.setFieldValue("demoVideo", e.target.files[0]);
                      }}
                      className="bg-black text-white py-2 px-4 rounded w-full"
                    />
                    <ErrorMessage
                      name="demoVideo"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div className="w-1/2 p-4">
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Title
                    </label>
                    <Field
                      type="text"
                      id="title"
                      name="title"
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
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      rows="4"
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
                      htmlFor="chapterNo"
                      className="block text-sm font-medium text-gray-600"
                    >
                      ChapterNo
                    </label>
                    <Field
                      type="number"
                      id="chapterNo"
                      name="chapterNo"
                      autoComplete="chapterNo"
                      className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="chapterNo"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                  >
                    ADD Course
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <Toaster />
        <Footer />
      </div>
    </>
  );
}

export default AddChapters;

// import React, { useState, useEffect } from "react";
// import ChefNavbar from "../../../component/Navbar/ChefNavbar";
// import toast, { Toaster } from "react-hot-toast";
// import { axiosPrivate } from "../../../api/axios";
// import { useSelector } from "react-redux";
// import { auth, selectCurrentToken } from "../../../context/authReducer";
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
// import * as Yup from "yup";
// import Footer from "../../User/Footer/Footer";

// const AddChapter = () => {
//   const [demoVideo, setDemoVideo] = useState();
//   const [coverImage, setCoverImage] = useState(
//     "https://thumbs.dreamstime.com/b/add-photo-simple-icon-image-thumbnail-sign-picture-placeholder-symbol-classic-flat-style-quality-design-element-simple-add-photo-220710759.jpg"
//   );
//   const token = useSelector(selectCurrentToken);
//   const user = useSelector(auth);
//   const navigate = useNavigate();

//   const initialValues = {
//     chapterNo: "",
//     title: "",
//     description: "",
//   };

//   const validationSchema = Yup.object({
//     title: Yup.string().required("Title is required"),
//     description: Yup.string().required("Description is required"),
//     chapterNo: Yup.number()
//       .required("Chapter number is required")
//       .positive("Chapter number must be positive"),
//   });

//   const formik = useFormik({
//     initialValues,
//     validationSchema,
//     // onSubmit: handleSubmit, // You can uncomment this line if needed
//   });

//   const handleValuesChange = (e) => {
//     formik.handleChange(e);
//   };

//   const handleCoverImageChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       setCoverImage(file);
//     }
//   };

//   const handleDemoVideoChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       setDemoVideo(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!demoVideo || !coverImage) {
//       toast.error("Fields must be filled", {
//         position: "top-right",
//         duration: 3000,
//         hideProgressBar: true,
//         closeButton: true,
//       });
//       return;
//     }

//     const postData = {
//       ...formik.values,
//       id: location.state?.id, // Assuming you are getting course ID from location state
//       demoVideo,
//       coverImage,
//     };

//     try {
//       const loadingToastId = toast.loading(
//         "Adding your chapter. Please wait..."
//       );
//       const response = await axiosPrivate.post("/chef/add-chapter", postData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.dismiss(loadingToastId);

//       if (response.status === 201) {
//         toast.success(response.data.message);
//         navigate("");
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const cardStyle4 = {
//     background:
//       "linear-gradient(to right, hsl(210, 40%, 95%), hsl(0, 40%, 95%), hsl(60, 100%, 95%))",
//   };

//   return (
//     <>
//       <div className=" bg-gray-200 ">
//         <ChefNavbar />
//         <Formik
//           enableReinitialize
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           // onSubmit={handleSubmit}
//         >
//           {(formik) => (
//             <Form encType="multipart/form-data">
//               <div className="flex p-4">
//                 {/* Left side: Add Thumbnail Card */}
//                 <div
//                   className="w-1/2 p-4 bg-white rounded-lg shadow-md dark:bg-neutral-800"
//                   style={cardStyle4}
//                 >
//                   <h2 className="text-xl font-medium mb-4 text-neutral-800 dark:text-neutral-50">
//                     Add Thumbnail and Demo Video
//                   </h2>
//                   <div className="mb-4">
//                     {/* Thumbnail Section */}
//                     <h3 className="text-lg font-medium mb-2 text-neutral-800 dark:text-neutral-50">
//                       Thumbnail
//                     </h3>
//                     <img
//                       src={
//                         coverImage instanceof File
//                           ? URL.createObjectURL(coverImage)
//                           : coverImage
//                       }
//                       alt="coverImage"
//                       className="w-full max-w-xs h-32 object-cover rounded-lg mb-2"
//                       style={cardStyle4}
//                     />
//                     <input
//                       id="coverImage"
//                       name="coverImage"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleCoverImageChange}
//                       className="bg-black text-white py-2 px-4 rounded w-full mb-4"
//                     />

//                     {/* Demo Video Section */}
//                     <h3 className="text-lg font-medium mb-2 text-neutral-800 dark:text-neutral-50">
//                       Demo Video
//                     </h3>
//                     <video
//                       controls
//                       src={
//                         demoVideo instanceof File
//                           ? URL.createObjectURL(demoVideo)
//                           : demoVideo
//                       }
//                       className="w-full max-w-xs h-32 object-cover rounded-lg mb-2"
//                     ></video>
//                     <input
//                       id="demoVideo"
//                       name="demoVideo"
//                       type="file"
//                       accept="video/*"
//                       onChange={handleDemoVideoChange}
//                       className="bg-black text-white py-2 px-4 rounded w-full"
//                     />
//                     <ErrorMessage
//                       name="demoVideo"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>
//                 </div>

//                 {/* Right side: Input Fields */}
//                 <div className="w-1/2 p-4">
//                   <div className="mb-6">
//                     <label
//                       htmlFor="large-input"
//                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                     >
//                       Chapter Title
//                     </label>
//                     <input
//                       type="text"
//                       id="title"
//                       name="title"
//                       onChange={handleValuesChange}
//                       autoComplete="chaptertitle"
//                       className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                     />
//                     <ErrorMessage
//                       name="title"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>

//                   <div className="mb-6">
//                     <label
//                       htmlFor="default-input"
//                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                     >
//                       Description
//                     </label>
//                     <textarea
//                       id="description"
//                       rows="4"
//                       onChange={handleValuesChange}
//                       autoComplete="description"
//                       name="description"
//                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 resize-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                     />
//                     <ErrorMessage
//                       name="description"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>

//                   <div className="mb-6">
//                     <label
//                       htmlFor="chapterNo"
//                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                     >
//                       Chapter Number
//                     </label>
//                     <input
//                       type="number"
//                       id="chapterNo"
//                       name="chapterNo"
//                       onChange={handleValuesChange}
//                       className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                     />
//                     <ErrorMessage
//                       name="chapterNo"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handleSubmit(e);
//                     }}
//                   >
//                     ADD Chapter
//                   </button>
//                 </div>
//                 <Toaster />
//               </div>
//             </Form>
//           )}
//         </Formik>
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default AddChapter;
