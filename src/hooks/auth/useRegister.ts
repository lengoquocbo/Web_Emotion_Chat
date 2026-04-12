import { useState } from "react";
import { RegisterService } from "../../services/authService";
import { isValidPassword,isValidEmail,isMatchPassword } from "../../utils/validation";

export const useRegister = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //khai báo constuctor 
  const handleRegister = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    displayName: string
  ) => {
    setLoading(true);
    setError("");
    // kiểm tra email hợp lệ
    if(!isValidEmail(email)) {
      setError("Email không hợp lệ");
      setLoading(false);
      return;
    }
    // kiểm tra password hợp lệ
    if(!isValidPassword(password)) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      setLoading(false);
      return;
    }
    // kiểm tra confirm password có khớp với password không
    if (!isMatchPassword(password, confirmPassword)) {
      setError("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    try {
  await RegisterService({ username, email, password, displayName });
  // Nếu không throw = thành công (2xx)
  setError("Đăng ký thành công");
  alert("Đăng ký thành công! Chuyển đến trang đăng nhập...");
  setTimeout(() => {
    window.location.href = "/login";
  }, 1500);
} catch (err: any) {
  const errorMessage =
    err?.response?.data?.message || 
    err?.message || 
    "Đăng ký thất bại";
  setError(errorMessage);
  console.error("Register error:", err);
} finally {
  setLoading(false);
}
  
  };

  return { handleRegister, error, loading };
};