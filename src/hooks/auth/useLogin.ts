import { useState } from "react";
import axios from "axios";

import { useAuth } from "./useAuth";
import { isValidPassword, isValidEmail } from "../../utils/validation";
import { LoginService } from "../../services/authService";

export const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    if (!isValidEmail(email)) {
      setError("Email không hợp lệ");
      setLoading(false);
      return false;
    }

    if (!isValidPassword(password)) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      setLoading(false);
      return false;
    }

    try {
      // Gọi API đăng nhập
      const res = await LoginService({
        emailOrUsername: email,
        password,
      });
     // Kiểm tra dữ liệu trả về có hợp lệ không
      const authData = res?.data ?? res;
// Nếu API trả về dữ liệu không đúng định dạng, hiển thị lỗi  
      if (!authData?.accessToken || !authData?.user) {
        setError("Dữ liệu đăng nhập trả về không đúng");
        return false;
      }
//
      login(authData);
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Sai email hoặc password");
      } else {
        console.error("Login error:", err);
        setError("Có lỗi xảy ra khi đăng nhập");
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, error, loading };
};
