import axios from "axios";

const api = axios.create({
  baseURL: "https://adminpersonalsite.onrender.com/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("portfolio_admin_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !String(error.config?.url || "").includes("/auth/login")
    ) {
      localStorage.removeItem("portfolio_admin_token");
      localStorage.removeItem("portfolio_admin_user");

      window.dispatchEvent(new Event("admin-session-expired"));
    }

    return Promise.reject(error);
  },
);

export const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong"
  );
};

export default api;
