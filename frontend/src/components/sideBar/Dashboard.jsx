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
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#E013CC" }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        max: 100,
        grid: { color: "#f0f0f0" }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: { boxWidth: 12, padding: 15 }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: { color: "#f0f0f0" }
      },
      x: {
        grid: { display: false }
      }
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
    <div className="flex flex-col h-full w-full gap-4 sm:gap-6 bg-white px-2 sm:px-4 pb-4 overflow-y-auto">
         
      {/* Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-2 sm:my-4">
        <div className="bg-white text-[#E013CC] border border-[#DBD9DB] rounded-lg p-3 sm:p-4 shadow hover:scale-105 transform transition duration-300">
          <p className="text-xs sm:text-sm text-gray-600">Total Analyses</p>
          <p className="text-xl sm:text-2xl font-bold">{stats.total_analyses}</p>
        </div>
        
        <div className="bg-white text-[#E013CC] border border-[#DBD9DB] rounded-lg p-3 sm:p-4 shadow hover:scale-105 transform transition duration-300">
          <p className="text-xs sm:text-sm text-gray-600">Avg Sentiment</p>
          <p className="text-xl sm:text-2xl font-bold">{stats.avg_sentiment}%</p>
        </div>
        
        <div className="bg-white text-[#E013CC] border border-[#DBD9DB] rounded-lg p-3 sm:p-4 shadow hover:scale-105 transform transition duration-300">
          <p className="text-xs sm:text-sm text-gray-600">Risk Alerts</p>
          <p className="text-xl sm:text-2xl font-bold">{stats.risk_alerts}</p>
        </div>
        
        <div className="bg-white text-[#E013CC] border border-[#DBD9DB] rounded-lg p-3 sm:p-4 shadow hover:scale-105 transform transition duration-300">
          <p className="text-xs sm:text-sm text-gray-600">Topics Analyzed</p>
          <p className="text-xl sm:text-2xl font-bold">{stats.topics_analyzed}</p>
        </div>
      </div>

      {/* Charts Section - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        
        {/* Sentiment Over Time Chart */}
        <div className="flex flex-col bg-white p-3 sm:p-4 rounded-lg shadow border border-[#0000001f] h-[300px] sm:h-[350px]">
          <h2 className="text-base sm:text-lg text-[#3F3E3E] font-bold mb-2 sm:mb-4">
            Sentiment Over Time
          </h2>
          <div className="flex-1 w-full">
            {sentimentData.labels.length > 0 ? (
              <Line data={sentimentData} options={lineOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No sentiment data available
              </div>
            )}
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="flex flex-col bg-white p-3 sm:p-4 rounded-lg shadow border border-[#0000001f] h-[300px] sm:h-[350px]">
          <h2 className="text-base sm:text-lg text-[#3F3E3E] font-bold mb-2 sm:mb-4">
            Risk Distribution
          </h2>
          <div className="flex-1 w-full">
            {riskData.datasets[0].data.some(val => val > 0) ? (
              <Pie data={riskData} options={pieOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No risk data available
              </div>
            )}
          </div>
        </div>

        {/* Topic Frequency Chart */}
        <div className="flex flex-col bg-white p-3 sm:p-4 rounded-lg shadow border border-[#0000001f] h-[300px] sm:h-[350px]">
          <h2 className="text-base sm:text-lg text-[#3F3E3E] font-bold mb-2 sm:mb-4">
            Topic Frequency
          </h2>
          <div className="flex-1 w-full">
            {topicsData.labels.length > 0 ? (
              <Bar data={topicsData} options={barOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No topic data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optional: Additional Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-2">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600">Positive Sentiment</p>
          <p className="text-lg font-semibold text-green-600">
            {sentimentData.datasets[0].data.length > 0 
              ? Math.round(sentimentData.datasets[0].data.reduce((a, b) => a + b, 0) / sentimentData.datasets[0].data.length) 
              : 0}%
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600">Total Messages</p>
          <p className="text-lg font-semibold text-[#E013CC]">
            {stats.total_analyses}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600">Risk Ratio</p>
          <p className="text-lg font-semibold text-orange-600">
            {stats.total_analyses > 0 
              ? Math.round((stats.risk_alerts / stats.total_analyses) * 100) 
              : 0}%
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600">Topics/Msg</p>
          <p className="text-lg font-semibold text-blue-600">
            {stats.total_analyses > 0 
              ? (stats.topics_analyzed / stats.total_analyses).toFixed(1) 
              : 0}
          </p>
        </div>
      </div>
    </div>
  );
}