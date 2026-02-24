import axios from "axios";

const API_BASE = "https://pulseai-optd.onrender.com"; // HARDCODED
console.log("🔥 USING BACKEND:", API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // consistent naming
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
