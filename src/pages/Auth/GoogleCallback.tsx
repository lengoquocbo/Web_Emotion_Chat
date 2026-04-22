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
        login(res);
        navigate("/home", { replace: true });
      } catch (err) {
        console.error("Lá»—i GoogleCallback:", err);
        navigate("/login?error=ÄÄƒng nháº­p tháº¥t báº¡i", { replace: true });
      }
    };

    handleCallback();
  }, [login, navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <p>Äang xá»­ lÃ½ Ä‘Äƒng nháº­p...</p>
    </div>
  );
};

export default GoogleCallback;
