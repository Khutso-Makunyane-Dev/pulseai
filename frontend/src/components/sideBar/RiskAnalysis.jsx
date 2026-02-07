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
  const [sidebarOpen, setSidebarOpen] = useState(true); // toggle sidebar
  const [activeSection, setActiveSection] = useState("AISummaries"); // active section
  const [pulseVersion, setPulseVersion] = useState(false);
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState(false);

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
    <div className="flex flex-col w-full gap-2 h-screen bg-white">
             
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg text-[#3F3E3E] font-bold mb-2">Sentiment Over Time</h2>
                <Line data={sentimentData} className="h-full" />
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg text-[#3F3E3E]  font-bold mb-2">Risk Distribution</h2>
                <Pie data={riskData} />
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg text-[#3F3E3E]  font-bold mb-2">Topic Frequency</h2>
                <Bar data={topicsData} />
              </div>
            </div>

            {/* Recent Analyses Table */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg text-[#3F3E3E] font-bold mb-4">Recent Analyses</h2>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-[#3F3E3E]">
                    <th className="py-2">Text</th>
                    <th className="py-2">Sentiment</th>
                    <th className="py-2">Confidence</th>
                    <th className="py-2">Risk</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="py-2">I love AI!</td>
                    <td className="py-2 text-green-500 font-bold">POSITIVE</td>
                    <td className="py-2">0.98</td>
                    <td className="py-2">Low</td>
                    <td className="py-2 text-[#3F3E3E]">2026-01-26</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="py-2">This product is bad.</td>
                    <td className="py-2 text-red-500 font-bold">NEGATIVE</td>
                    <td className="py-2">0.85</td>
                    <td className="py-2">High</td>
                    <td className="py-2 text-[#3F3E3E]">2026-01-25</td>
                  </tr>
                </tbody>
              </table>
            </div>
        

    </div>
  );
}


