import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;
      const isLoginPage = window.location.pathname === "/login";

      if (status === 401 && !isLoginPage) {
        Cookies.remove("token");
        window.location.href = "/login";
      } else if (status === 403) {
        console.error("Forbidden - không có quyền truy cập");
      } else if (status === 500) {
        console.error("Server error - lỗi server");
      }
    } else {
      console.error("Network error:", error.message);
      console.error("Base URL:", import.meta.env.VITE_API_URL);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
