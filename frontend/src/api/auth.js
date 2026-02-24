import axios from "axios";

// 🔥 HARDCODED - THIS IS THE ONLY WAY
const API_BASE = "https://pulseai-optd.onrender.com";

console.log("%c🔧 BACKEND URL HARDCODED TO:", "color: green; font-weight: bold", API_BASE);

const api = axios.create({
  baseURL: API_BASE, // Hardcoded - no environment variable
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log every request to verify URL
    console.log(`🌍 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;