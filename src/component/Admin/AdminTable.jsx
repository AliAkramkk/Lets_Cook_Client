import React, { useState, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
} from "@material-tailwind/react";
import { selectCurrentToken } from "../../context/authReducer";
import { useSelector } from "react-redux";
import { axiosPrivate } from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";

const AdminTable = () => {
  const TABLE_HEAD = [
    "NO",
    "Date",

    "Student",
    "Courses",
    "Chef Name",
    "Course Price",
    "Payment Status",
  ];
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector(selectCurrentToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/admin/adminTable", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayments(response.data.payment);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = payments.slice(indexOfFirstRow, indexOfLastRow);

  const handlePayment = async (paymentId, isDivided) => {
    try {
      if (!isDivided) {
        const response = await axiosPrivate.put(
          `/admin/updatePayment/${paymentId}`,
          { isDivided: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment._id === paymentId
              ? { ...payment, isDivided: true }
              : payment
          )
        );

        // Display success toast
        toast.success("Payment status updated successfully");
      } else {
        console.log("Payment already completed");
        // Display info toast
        toast.info("Payment has already been completed");
      }
    } catch (error) {
      console.error("Error updating payment:", error.message);

      // Display error toast
      toast.error("Failed to update payment status");
    }
  };

  const cardStyle4 = {
    background:
      "linear-gradient(to right, hsl(210, 40%, 95%), hsl(0, 40%, 95%), hsl(60, 100%, 95%))",
  };

  const renderTableRows = () => {
    return currentRows.map(
      (
        { _id, user_id, chef_id, course_id, amount, date, isDivided },
        index
      ) => {
        const isLast = index === currentRows.length - 1;
        const classes = isLast
          ? "p-4 font-semibold"
          : "p-4 font-semibold border-b border-blue-gray-50";

        return (
          <tr key={_id}>
            <td className={classes}>{index + 1}</td>
            <td className={classes}>{new Date(date).toLocaleDateString()}</td>
            {/* <td className={classes}>{_id}</td> */}
            <td className={classes}>{user_id?.username || "N/A"}</td>
            <td className={classes}>{course_id && course_id.title}</td>
            <td className={classes}>{chef_id.username}</td>
            <td className={classes}>{amount}</td>
            <td className={classes}>
              <Button
                size="sm"
                variant="outlined"
                color={isDivided ? "green" : "amber"}
                // onClick={() => handlePayment(_id, isDivided)}
              >
                {isDivided ? "Paid" : "Unpaid"}
              </Button>
            </td>
          </tr>
        );
      }
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Card className="h-full w-full" style={cardStyle4}>
      <CardBody className="overflow-scroll px-0">
        {loading ? (
          <p>Loading...</p>
        ) : currentRows.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-semibold leading-none opacity-80"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        )}
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button
          variant="outlined"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {Array.from(
            { length: Math.ceil(payments.length / rowsPerPage) },
            (_, i) => (
              <IconButton
                key={i + 1}
                variant="outlined"
                size="sm"
                color={currentPage === i + 1 ? "blue" : "gray"}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </IconButton>
            )
          )}
        </div>
        <Button
          variant="outlined"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(payments.length / rowsPerPage)}
        >
          Next
        </Button>
      </CardFooter>
      <Toaster position="bottom-right" />
    </Card>
  );
};

export default AdminTable;
