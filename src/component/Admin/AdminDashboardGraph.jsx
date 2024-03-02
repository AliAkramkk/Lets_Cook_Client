import React, { useState, useEffect } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import { axiosPrivate } from "../../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../context/authReducer";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "center";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";
const AdminDashboardGraph = () => {
  const token = useSelector(selectCurrentToken);
  const [data, setData] = useState({
    student: null,
    teacher: null,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/admin/graph", {
          headers: {
            Authorization: `Bearer ${token}`,
            // Add any other headers if needed
          },
        });
        const responseData = response.data;
        console.log("response", responseData);

        setData({
          students: responseData.student,
          teachers: responseData.teacher,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-64 flex flex-col md:flex-row gap-2">
      <div className="w-full md:w-1/2 h-full bg-gray-100 rounded-md flex justify-center items-center">
        <Doughnut
          data={{
            labels: data?.students?.map((dat) =>
              new Date(dat.date).toLocaleDateString("en-US", { month: "long" })
            ),
            datasets: [
              {
                label: "Students",
                data: data?.students?.map((dat) => dat.count),
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                ],
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Students",
              },
            },
          }}
        />
      </div>
      <div className="w-full md:w-1/2 h-full bg-gray-100 rounded-md flex justify-center items-center">
        <Doughnut
          data={{
            labels: data?.teachers?.map((dat) =>
              new Date(dat.date).toLocaleDateString("en-US", { month: "long" })
            ),
            datasets: [
              {
                label: "Teachers",
                data: data?.teachers?.map((dat) => dat.count),
                backgroundColor: [
                  "rgba(13, 149, 170, 0.8)",
                  "rgba(226, 58, 20, 0.8)",
                ],
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Teachers",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboardGraph;
