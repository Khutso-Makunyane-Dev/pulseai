import axios from "axios";

// Use environment variable with fallback
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

console.log("%c🔧 BACKEND URL:", "color: green; font-weight: bold", API_BASE);
console.log("🌍 Environment:", import.meta.env.MODE);

const api = axios.create({
  baseURL: API_BASE,
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
    console.log(`🌍 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;