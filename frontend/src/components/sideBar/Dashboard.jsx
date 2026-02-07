// Dashbaord
import React, { useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// -----------------------------
// Register Chart.js components
// -----------------------------
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {

  // Dummy chart data
  const sentimentData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Sentiment Score",
        data: [65, 59, 80, 81, 56],
        fill: false,
        backgroundColor: "#E013CC",
        borderColor: "#E013CC",
        tension: 0.4,
      },
    ],
  };

  const riskData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Risk Levels",
        data: [12, 19, 7],
        backgroundColor: ["#4ade80", "#facc15", "#ef4444"],
      },
    ],
  };

  const topicsData = {
    labels: ["AI", "Python", "ML", "Data", "Cloud"],
    datasets: [
      {
        label: "Topics Frequency",
        data: [12, 19, 7, 15, 10],
        backgroundColor: "#E013CC",
      },
    ],
  };

  return (
    <div className="flex flex-col h-full w-full gap-2 bg-white px-4">
             
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 ">
              <div className="bg-white text-[#E013CC] border border-[#DBD9DB] rounded-lg p-4 shadow hover:scale-105 transform transition">
                <p className="text-sm">Total Analyses</p>
                <p className="text-2xl font-bold">120</p>
              </div>
              <div className="bg-white text-[#E013CC] border border-[#DBD9DB]  rounded-lg p-4 shadow hover:scale-105 transform transition">
                <p className="text-sm">Avg Sentiment</p>
                <p className="text-2xl font-bold">75%</p>
              </div>
              <div className="bg-white text-[#E013CC] border border-[#DBD9DB]  rounded-lg p-4 shadow hover:scale-105 transform transition">
                <p className="text-sm">Risk Alerts</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="bg-white text-[#E013CC] border border-[#DBD9DB]  rounded-lg p-4 shadow hover:scale-105 transform transition">
                <p className="text-sm">Topics Analyzed</p>
                <p className="text-2xl font-bold">35</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="flex flex-wrap gap-4 w-full p-2 ">

                <div className="flex flex-col justify-center items-center 
                                w-full md:w-[32%] 
                                bg-white p-2 rounded-lg shadow border border-[#0000001f]">
                    <h2 className="text-lg text-[#3F3E3E] font-bold mb-10">
                    Sentiment Over Time
                    </h2>
                    <Line data={sentimentData} />
                </div>

                <div className="flex flex-col justify-center items-center 
                                w-full md:w-[32%] 
                                bg-white p-2 rounded-lg shadow border border-[#0000001f]">
                    <h2 className="text-lg text-[#3F3E3E] font-bold mb-2">
                    Risk Distribution
                    </h2>
                    <Pie data={riskData} />
                </div>

                <div className="flex flex-col justify-center items-center 
                                w-full md:w-[32%] 
                                bg-white p-2 rounded-lg shadow border border-[#0000001f]">
                    <h2 className="text-lg text-[#3F3E3E] font-bold mb-2">
                    Topic Frequency
                    </h2>
                    <Bar data={topicsData} />
                </div>

            </div>
    </div>
  );
}


