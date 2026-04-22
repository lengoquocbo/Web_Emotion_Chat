import { useState } from "react";
import axios from "axios";

import { useAuth } from "./useAuth";
import { isValidPassword, isValidEmail } from "../../utils/validation";
import { getMeService, LoginService } from "../../services/authService";

export const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    if (!isValidEmail(email)) {
      setError("Email khong hợp lệ");
      setLoading(false);
      return false;
    }

    if (!isValidPassword(password)) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      setLoading(false);
      return false;
    }

   try {
    await LoginService({ emailOrUsername: email, password });

    const me = await getMeService();
    login(me);
    return true;

  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || "Sai email hoặc password");
    } else {
      setError("Có lỗi xảy ra khi đăng nhập");
    }
    return false;
  } finally {
    setLoading(false);
  }
  };

  return { handleLogin, error, loading };
};
