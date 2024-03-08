import { useState, Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Input, Textarea } from "@material-tailwind/react";
import Dropzone from "react-dropzone";
// import { Toaster } from "react-hot-toast";
import toast, { Toaster } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import ToastHelper from "../../helper/ToastHelper";
import UserNavbar from "../../component/Navbar/UserNavbar";
import { axiosPrivate } from "../../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../context/authReducer";
import Swal from "sweetalert2";
const MyBlog = () => {
  const toastHelper = new ToastHelper();

  const [isOpen, setIsOpen] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [values, setValues] = useState({
    title: "",
    description: "",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCoverImage, setEditCoverImage] = useState(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [editValues, setEditValues] = useState({
    title: "",
    description: "",
  });

  const [fetch, setFetch] = useState(false);
  const [blogs, setBlogs] = useState(null);

  const [blogId, setBlogId] = useState(null);
  const [content, setContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();
  const token = useSelector(selectCurrentToken);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const showDeleteAlert = async (onDelete) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      onDelete();
    }
  };

  function closeModal() {
    setCoverImage(null);
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeEditModal() {
    setIsEditOpen(false);
  }

  function openEditModal(id, title, description) {
    setBlogId(id);
    setEditValues({ title, description });
    setIsEditOpen(true);
  }

  function closeImageModal() {
    setEditCoverImage(null);
    setIsImageOpen(false);
  }

  function openImageModal(id) {
    setBlogId(id);
    setIsImageOpen(true);
  }

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file && file.type.startsWith("image/")) {
      setCoverImage(acceptedFiles[0]);
    } else {
      toastHelper.showToast("Please upload a valid image file.");
    }
  };

  const handleEditImageDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file && file.type.startsWith("image/")) {
      setEditCoverImage(acceptedFiles[0]);
    } else {
      toastHelper.showToast("Please upload a valid image file.");
    }
  };

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleEditChanges = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value.trim() });
  };

  const handleCreateBlog = () => {
    if (
      values.title.trim() === "" ||
      values.description.trim() === "" ||
      !coverImage
    ) {
      toastHelper.showToast("Fill the Form");
      return;
    }

    const postData = {
      ...values,
      coverImage: coverImage,
    };
    console.log(postData);
    axiosPrivate
      .post("/user/myBlog", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setFetch(true);
      })
      .catch((err) => {
        console.log(err);
      });

    closeModal();
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  const truncatedDescription = blogs?.description?.slice(0, 100);
  const handleEditBlog = () => {
    if (editValues.title === "" || editValues.description === "") {
      toastHelper.showToast("Fill the Form");
      return;
    }

    const putData = { ...editValues };
    console.log(putData);

    axiosPrivate
      .put(`/user/myBlog/${blogId}`, putData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Add any other headers if needed
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        setFetch(true);
      })
      .catch((err) => {
        console.log(err);
      });

    closeEditModal();
  };

  const handleChangeBlogImage = () => {
    if (!editCoverImage) {
      toastHelper.showToast("Select a image");
      return;
    }

    console.log(editCoverImage);
    axiosPrivate
      .put(
        `/user/myBlogImage/${blogId}`,
        { image: editCoverImage },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setFetch(true);
      })
      .catch((err) => {
        console.log(err);
      });

    closeImageModal();
  };

  const handleDeleteBlog = async (id) => {
    showDeleteAlert(async () => {
      // Display confirmation message
      const result = window.confirm(
        "Are you sure you want to delete this blog?"
      );

      // If confirmed, proceed with the deletion
      const response = await axiosPrivate.delete(`/user/myBlog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      toast.success(response.data.message);
      setFetch(true);
      // return "Blog deleted successfully!";
    });
  };

  const fetchMyBlogs = () => {
    axiosPrivate
      .get(`/user/myBlog?page=${currentPage.current}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Add any other headers if needed
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setBlogs(res?.data?.results?.myBlogs);
        setPageCount(res?.data?.results?.pageCount);
        currentPage.current = res?.data?.results?.page;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePageClick = (e) => {
    currentPage.current = e.selected + 1;
    fetchMyBlogs();
  };

  useEffect(() => {
    fetchMyBlogs();
    setFetch(false);
  }, [fetch]);

  return (
    <>
      <div className="bg-gray-100 w-screen h-screen overflow-x-hidden">
        <UserNavbar />
        <Toaster />
        <div className="w-full h-full p-5 flex flex-col gap-5  ">
          <div className="flex justify-center flex-wrap">
            {blogs &&
              blogs.map((blog) => (
                //   <div className="w-full h-24 rounded-lg shadow-lg bg-white flex gap-5 cursor-pointer">
                //     <img
                //       src={blog?.coverImage?.url}
                //       className="w-1/6 h-full object-fit rounded-l-lg hover:bg-black hover:opacity-80"
                //       alt="pic"
                //       onClick={() => openImageModal(blog?._id)}
                //     />
                //     <div
                //       className="w-full h-full font-bold flex justify-center items-center truncate"
                //       onClick={() =>
                //         openEditModal(blog?._id, blog?.title, blog?.description)
                //       }
                //     >
                //       {blog?.title}
                //     </div>
                //     <div className="bg-gray-400 flex justify-center items-center rounded-r-lg px-10">
                //       <MdDelete
                //         className="text-2xl"
                //         onClick={() => handleBlogDelete(blog?._id)}
                //       />
                //     </div>
                //   </div>
                // ))}
                <div className="flex justify-center ">
                  <div className="w-full sm:w-1/2 md:w-1/3 lg:w-80 bg-gray-200 mx-2 rounded-md my-4 overflow-hidden hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105">
                    <div className="flex justify-center pt-2">
                      <p className="text-lg font-semibold text-gray-800 mb-2"></p>
                    </div>
                    <Link>
                      <img
                        className="w-full h-56 object-cover px-4"
                        style={{ objectFit: "cover" }}
                        src={blog.coverImage.url}
                        alt=""
                        onClick={() => openImageModal(blog?._id)}
                      />
                    </Link>
                    <div className="p-5">
                      <Link>
                        <h5
                          className="text-gray-900 font-bold text-2xl tracking-tight mb-2"
                          onClick={() =>
                            openEditModal(
                              blog?._id,
                              blog?.title,
                              blog?.description
                            )
                          }
                        >
                          {blog.title}
                        </h5>
                      </Link>
                      <p className="font-normal text-gray-700 mb-3">
                        {/* {blog.description} */}
                        {showFullDescription
                          ? blog?.description
                          : truncatedDescription}
                        {!showFullDescription &&
                          truncatedDescription?.length >= 20 && (
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
                        className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center mt-2"
                        onClick={() => handleDeleteBlog(blog._id)}
                      >
                        Delete Blog
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div
            className="w-full h-24 rounded-lg shadow-lg bg-white flex gap-5 cursor-pointer"
            onClick={openModal}
          >
            <div className=" w-full h-16 font-extrabold text-lg flex justify-center items-center hover:bg-gray-300">
              Add Blog
            </div>
          </div>

          <div className="w-full flex justify-center py-5">
            <ReactPaginate
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={2}
              marginPagesDisplayed={0}
              pageCount={pageCount}
              // initialPage={currentPage.current}
              forcePage={currentPage.current}
              previousLabel="<"
              pageClassName="inline-block mx-1 page-item"
              pageLinkClassName=" p-2 page-link"
              previousClassName="inline-block mx-1 page-item font-bold"
              previousLinkClassName=" p-2 page-link "
              nextClassName="inline-block mx-1 page-item font-bold"
              nextLinkClassName="p-2 page-link"
              breakLabel="..."
              breakClassName="page-item inline-flex"
              breakLinkClassName="page-link "
              containerClassName="pagination"
              activeClassName="active bg-red-500"
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
        <Toaster />
      </div>

      {/* create blog modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create Blog
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Input
                      label="Title"
                      name="title"
                      onChange={handleChanges}
                    />
                    <Textarea
                      label="Description"
                      name="description"
                      onChange={handleChanges}
                    />
                    <Dropzone onDrop={handleDrop}>
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div
                            className="w-full h-40 border-2 border-gray-400 border-dashed flex items-center justify-center cursor-pointer"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <div className="flex flex-col h-full justify-center">
                              {coverImage ? (
                                <div className="h-1/3 flex items-center justify-center">
                                  {coverImage.name}
                                </div>
                              ) : (
                                <p>
                                  Drag 'n' drop some files here, or click to
                                  select files
                                </p>
                              )}
                              {coverImage && (
                                <img
                                  className="w-full h-2/3 object-center pb-4"
                                  src={URL.createObjectURL(coverImage)}
                                ></img>
                              )}
                            </div>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleCreateBlog}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Change image modal */}
      <Transition appear show={isImageOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeImageModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Image Upload
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Dropzone
                      accept={["image/*"]}
                      multiple={false}
                      onDrop={handleEditImageDrop}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div
                            className="w-full h-40 border-2 border-gray-400 border-dashed outline-none flex items-center justify-center cursor-pointer"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <div className="flex flex-col h-full justify-center">
                              {editCoverImage ? (
                                <div className="h-1/3 flex items-center justify-center">
                                  {editCoverImage.name}
                                </div>
                              ) : (
                                <p>
                                  Drag 'n' drop image here, or click to select
                                  image
                                </p>
                              )}
                              {editCoverImage && (
                                <img
                                  className="w-full h-2/3 object-center pb-4"
                                  src={URL.createObjectURL(editCoverImage)}
                                ></img>
                              )}
                            </div>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleChangeBlogImage}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Blog modal */}
      <Transition appear show={isEditOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeEditModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className={`fixed inset-0 bg-black/25`} />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Edit Course
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Input
                      label="Title"
                      name="title"
                      value={editValues.title}
                      onChange={handleEditChanges}
                    />
                    <Textarea
                      label="Description"
                      name="description"
                      value={editValues.description}
                      onChange={handleEditChanges}
                    />
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleEditBlog}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MyBlog;
