import React from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { selectCurrentToken, auth } from "../../../context/authReducer";
import { axiosPrivate } from "../../../api/axios";
import ChefNavbar from "../../../component/Navbar/ChefNavbar";

const ChefTransactions = () => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(auth);
  console.log("user", user.id);
  const [paymentData, setPaymentData] = useState(null);
  const [message, setMessage] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();

  const handlePageClick = (e) => {
    currentPage.current = e.selected + 1;
    fetchPayments();
  };

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axiosPrivate.get(
          `/chef/paymentData?page=${currentPage.current}&chefId=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("response", response);
        if (response?.data?.message) {
          setMessage(response.data.message);
        } else {
          setPaymentData(response?.data?.results?.payments);
          setPageCount(response?.data?.results?.pageCount);
          currentPage.current = response?.data?.results?.page;
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPaymentData();
  }, []);
  return (
    <div className="h-screen w-screen overflow-x-hidden">
      <ChefNavbar />
      <div className="h-auto text-2xl text-black px-5 py-3 font-bold capitalize">
        Recent Transactions
      </div>

      <div className="h-auto relative overflow-x-auto px-5 py-3">
        {message ? (
          // Render the message if present
          <div className="text-red-500 font-bold">{message}</div>
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-100 uppercase bg-gray-700 ">
              <tr>
                <th scope="col" className="px-6 py-3 capitalize">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 capitalize">
                  Transaction Id
                </th>
                <th scope="col" className="px-6 py-3 capitalize">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 capitalize">
                  Students
                </th>
                <th scope="col" className="px-6 py-3 capitalize">
                  price
                </th>
                {/* <th scope="col" className="px-6 py-3 capitalize">
            Action
          </th> */}
              </tr>
            </thead>
            <tbody>
              {paymentData?.map((payment, index) => (
                <tr
                  key={index}
                  className=" border-b bg-gray-800 dark:border-gray-700 text-white"
                >
                  <td className="px-6 py-4">
                    {new Date(payment?.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {(payment?.strip_id).substring(0, 12)}
                  </td>
                  <td className="px-6 py-4">{payment?.course_id?.title}</td>
                  <td className="px-6 py-4">{payment?.user_id?.username}</td>
                  <td className="px-6 py-4">{payment?.amount}</td>
                  {/* <td className="px-6 py-4">
              {payment?.isTeacherPay ? (
                <Button disabled={true} color="red">
                  Paid
                </Button>
              ) : (
                <Button onClick={() => openModal(payment?._id)}>Pay</Button>
              )}
            </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
          pageClassName="inline-block mx-1 page-item rounded "
          pageLinkClassName="border p-2 page-link"
          previousClassName="inline-block mx-1 page-item font-bold"
          previousLinkClassName="border p-2 page-link "
          nextClassName="inline-block mx-1 page-item font-bold"
          nextLinkClassName="border p-2 page-link"
          breakLabel="..."
          breakClassName="page-item inline-flex"
          breakLinkClassName="page-link "
          containerClassName="pagination "
          activeClassName="active bg-red-500"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
};

export default ChefTransactions;
