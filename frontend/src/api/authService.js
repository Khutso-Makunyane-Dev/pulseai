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
export const fetchCurrentUser = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// -------------------
// Logout
// -------------------
export const logout = () => {
  localStorage.removeItem("accessToken");
};
