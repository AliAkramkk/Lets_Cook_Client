import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentToken,
  selectCurrentId,
} from "../../context/authReducer";
defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "center";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";
const TeacherDashboardGraph = () => {
  const [data, setData] = useState(null);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const chefId = useSelector(selectCurrentId);
  console.log("chefId", chefId);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await axiosPrivate.get(`/chef/graph/${chefId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            // Add any other headers if needed
          },
        });
        setData(response.data?.paymentData);
        console.log("response", response);
        console.log("Payment Data:", response.data?.paymentData);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchGraphData();
  }, []);

  return (
    <div className="h-64 flex flex-col md:flex-row gap-2 bg-gray-100 rounded-md">
      <div className="w-full  h-full bg-gray-100 rounded-md flex justify-center items-center">
        {data && data.length > 0 ? (
          <Line
            data={{
              //   labels: data.map((payment) =>
              //     new Date(payment?.date).toLocaleDateString("en-US", {
              //       month: "long",
              //     })
              //   ),
              labels: data.map(
                (payment) => new Date(payment?.date).toISOString().split("T")[0]
              ),

              datasets: [
                {
                  label: "Amount",
                  data: data.map((payment) => payment?.totalAmount),
                  backgroundColor: "#064FF0",
                  borderColor: "#064FF0",
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Payments",
                  align: "center",
                  font: {
                    size: 20,
                    color: "black",
                  },
                },
              },
            }}
          />
        ) : (
          <p>No payment data available.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboardGraph;
