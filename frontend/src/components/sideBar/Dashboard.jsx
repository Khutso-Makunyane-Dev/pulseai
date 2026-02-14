// Dashboard.jsx
import React, { useState, useEffect } from "react";
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
import { 
  getDashboardStats, 
  getSentimentTrends, 
  getRiskDistribution,
  getTopicsFrequency 
} from "../../api/dashboard";

// Register Chart.js components
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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_analyses: 0,
    avg_sentiment: 0,
    risk_alerts: 0,
    topics_analyzed: 0
  });
  
  const [sentimentData, setSentimentData] = useState({
    labels: [],
    datasets: [{
      label: "Sentiment Score",
      data: [],
      fill: false,
      backgroundColor: "#E013CC",
      borderColor: "#E013CC",
      tension: 0.4,
    }]
  });

  const [riskData, setRiskData] = useState({
    labels: ["Low", "Medium", "High"],
    datasets: [{
      label: "Risk Levels",
      data: [0, 0, 0],
      backgroundColor: ["#4ade80", "#facc15", "#ef4444"],
    }]
  });

  const [topicsData, setTopicsData] = useState({
    labels: [],
    datasets: [{
      label: "Topics Frequency",
      data: [],
      backgroundColor: "#E013CC",
    }]
  });

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [statsData, trendsData, riskDistData, topicsFreqData] = await Promise.all([
          getDashboardStats(),
          getSentimentTrends(),
          getRiskDistribution(),
          getTopicsFrequency()
        ]);
        
        // Update stats
        setStats(statsData);
        
        // Update sentiment chart
        setSentimentData({
          labels: trendsData.labels || [],
          datasets: [{
            label: "Sentiment Score",
            data: trendsData.data || [],
            fill: false,
            backgroundColor: "#E013CC",
            borderColor: "#E013CC",
            tension: 0.4,
          }]
        });
        
        // Update risk chart
        setRiskData({
          labels: riskDistData.labels || ["Low", "Medium", "High"],
          datasets: [{
            label: "Risk Levels",
            data: riskDistData.data || [0, 0, 0],
            backgroundColor: ["#4ade80", "#facc15", "#ef4444"],
          }]
        });
        
        // Update topics chart
        setTopicsData({
          labels: topicsFreqData.labels || [],
          datasets: [{
            label: "Topics Frequency",
            data: topicsFreqData.data || [],
            backgroundColor: "#E013CC",
          }]
        });
        
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#E013CC" }
    },
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E013CC] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full gap-2 bg-white px-4">
         
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white text-[#E013CC] border border-[#DBD9DB] rounded-lg p-4 shadow hover:scale-105 transform transition">
          <p className="text-sm">Total Analyses</p>
          <p className="text-2xl font-bold">{stats.total_analyses}</p>
        </div>
        <div className="bg-white text-[#E013CC] border border-[#DBD9DB] rounded-lg p-4 shadow hover:scale-105 transform transition">
          <p className="text-sm">Avg Sentiment</p>
          <p className="text-2xl font-bold">{stats.avg_sentiment}%</p>
        </div>
        <div className="bg-white text-[#E013CC] border border-[#DBD9DB] rounded-lg p-4 shadow hover:scale-105 transform transition">
          <p className="text-sm">Risk Alerts</p>
          <p className="text-2xl font-bold">{stats.risk_alerts}</p>
        </div>
        <div className="bg-white text-[#E013CC] border border-[#DBD9DB] rounded-lg p-4 shadow hover:scale-105 transform transition">
          <p className="text-sm">Topics Analyzed</p>
          <p className="text-2xl font-bold">{stats.topics_analyzed}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex flex-wrap gap-4 w-full p-2">
        {/* Sentiment Over Time */}
        <div className="flex flex-col justify-center items-center w-full md:w-[32%] bg-white p-2 rounded-lg shadow border border-[#0000001f]">
          <h2 className="text-lg text-[#3F3E3E] font-bold mb-10">
            Sentiment Over Time
          </h2>
          {sentimentData.labels.length > 0 ? (
            <Line data={sentimentData} options={lineOptions} />
          ) : (
            <p className="text-gray-400">No sentiment data available</p>
          )}
        </div>

        {/* Risk Distribution */}
        <div className="flex flex-col justify-center items-center w-full md:w-[32%] bg-white p-2 rounded-lg shadow border border-[#0000001f]">
          <h2 className="text-lg text-[#3F3E3E] font-bold mb-2">
            Risk Distribution
          </h2>
          {riskData.datasets[0].data.some(val => val > 0) ? (
            <Pie data={riskData} options={pieOptions} />
          ) : (
            <p className="text-gray-400">No risk data available</p>
          )}
        </div>

        {/* Topic Frequency */}
        <div className="flex flex-col justify-center items-center w-full md:w-[32%] bg-white p-2 rounded-lg shadow border border-[#0000001f]">
          <h2 className="text-lg text-[#3F3E3E] font-bold mb-2">
            Topic Frequency
          </h2>
          {topicsData.labels.length > 0 ? (
            <Bar data={topicsData} options={barOptions} />
          ) : (
            <p className="text-gray-400">No topic data available</p>
          )}
        </div>
      </div>
    </div>
  );
}