import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { getMeService } from "../../services/authService";

const GoogleCallback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
    

        const res = await getMeService();

        const token = document.cookie
          .split("; ")
          .find(row => row.startsWith("token="))
          ?.split("=")[1] ?? "";


        login({ accessToken: token, user: res, expiresAtUtc: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() });
        navigate("/home");
      } catch (err) {
        console.error("Lỗi GoogleCallback:", err);
        navigate("/login?error=Đăng nhập thất bại");
      }
    };

    handleCallback();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <p>Đang xử lý đăng nhập...</p>
    </div>
  );
};

export default GoogleCallback;