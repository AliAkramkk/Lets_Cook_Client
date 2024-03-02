import React, { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import ToastHelper from "../../../helper/ToastHelper";
import { axiosPrivate } from "../../../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../context/authReducer";
import BlogCard from "../../../component/User/BlogCard";
import UserNavbar from "../../../component/Navbar/UserNavbar";
import { FaSearch } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import Footer from "../Footer/Footer";
const Blog = () => {
  const toastHelper = new ToastHelper();
  const token = useSelector(selectCurrentToken);
  const [blogs, setBlogs] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();

  const fetchAllBlogs = async (search) => {
    try {
      const response = await axiosPrivate.get(
        `/user/blogs?page=${currentPage.current || 1}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Add any other headers if needed
          },
          withCredentials: true,
        }
      );
      console.log("response datat:", response.data);
      setBlogs(response.data.results.blogs);
      setPageCount(response?.data?.results?.pageCount);
      currentPage.current = response?.data?.results?.page;
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePageClick = (e) => {
    currentPage.current = e.selected + 1;
    fetchAllBlogs();
  };
  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    fetchAllBlogs(event.target.value);
  };
  return (
    <div className="w-screen h-screen overflow-x-hidden bg-gray-100">
      <UserNavbar />
      <div className="text-center mt-4 ml-8">
        <h2 className="text-3xl font-bold text-black-600">BLOGS</h2>
      </div>
      <div className="w-full h-full p-5 flex flex-col gap-5">
        <div className="w-full h-16 flex  items-center justify-end px-5">
          <form
            action=""
            className="border max-w-[400px] w-full md:p-4 p-2 mb-8  md:ml-10  shadow-lg rounded-lg flex  sm:me-10  "
            style={{ marginTop: "20px" }}
          >
            <input
              className="bg-gray-100 placeholder-gray-400 w-full text-sm outline-none focus:outline-none md:w-100"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleInputChange}
              style={{ color: "black" }}
            />
            <div
              className=" cursor-pointer  transition duration-300 ease-in-out transform hover:scale-150"
              // onClick={() =>
              //   navigate("/all-courses", { state: { searchTerm: searchTerm } })
              // }
            >
              <BiSearchAlt size={30} />
            </div>
          </form>
        </div>
        <div className="flex justify-center flex-wrap">
          {blogs && blogs.length !== 0 ? (
            blogs?.map((blog) => <BlogCard key={blog._id} blog={blog} />)
          ) : (
            <div className="h-40 w-full flex justify-center items-center">
              <div className="text-black text-4xl capitalize font-bold text-center">
                not found anything<span className="text-red-500">!</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-center py-10">
        <ReactPaginate
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          marginPagesDisplayed={0}
          pageCount={pageCount}
          forcePage={currentPage.current}
          previousLabel="<"
          pageClassName="inline-block mx-1 page-item rounded"
          pageLinkClassName="border p-2 page-link"
          previousClassName="inline-block mx-1 page-item font-bold"
          previousLinkClassName="border p-2 page-link"
          nextClassName="inline-block mx-1 page-item font-bold"
          nextLinkClassName="border p-2 page-link"
          breakLabel="..."
          breakClassName="page-item inline-flex"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active bg-gray-300"
          renderOnZeroPageCount={null}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
