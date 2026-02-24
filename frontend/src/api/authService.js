import api from "./auth";

// -------------------
// Signup
// -------------------
export const signup = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  // Save token on signup
  localStorage.setItem("accessToken", response.data.access_token);
  return response.data;
};

// -------------------
// Login
// -------------------
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  // Save token in localStorage
  localStorage.setItem("accessToken", response.data.access_token);

  // Return only the token; user info will be fetched via /auth/me
  return {
    access_token: response.data.access_token,
    token_type: response.data.token_type,
  };
};

// -------------------
// Fetch current user
// -------------------
const fetchCurrentUser = async (accessToken) => {
  try {
    // ✅ No need to manually add header - interceptor handles it
    const res = await api.get("/auth/me");
    setUser(res.data);
  } catch (err) {
    console.error("Invalid or expired token, logging out.", err);
    logout();
  } finally {
    setLoading(false);
  }
};

// -------------------
// Logout
// -------------------
export const logout = () => {
  localStorage.removeItem("accessToken");
};
