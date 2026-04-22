// axiosClient.ts
import axios, { AxiosError } from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;
      const isLoginPage = window.location.pathname === "/login";

      // ⚠️ Chỉ redirect khi KHÔNG phải đang ở login VÀ KHÔNG phải call /me bootstrap
      const isAuthMe = error.config?.url?.includes("/api/Auth/me");

      if (status === 401 && !isLoginPage && !isAuthMe) {
        window.location.href = "/login";
      }
    } else {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;