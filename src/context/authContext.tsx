import { createContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";

import { getMeService } from "../services/authService";
import { AuthResponse } from "../types/auth";

interface AuthContextType {
  user: AuthResponse["user"] | null;
  token: string | null;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [token, setToken] = useState<string | null>(Cookies.get("token") || null);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  const bootstrapAuth = async () => {
    try {
      // Không check cookie bằng JS nữa
      // Browser tự gửi HttpOnly cookie kèm request
      const res = await getMeService();
      setUser(res);
      setToken("session"); // đánh dấu đã login
    } catch {
      // /me thất bại = chưa login hoặc token hết hạn
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  bootstrapAuth();
}, []);

const login = (data: AuthResponse) => {
  setUser(data.user);

  if (data.accessToken) {
    // Login thường → FE set cookie
    setToken(data.accessToken);
    Cookies.set("token", data.accessToken, {
      expires: 7,
      sameSite: "strict",
      secure: window.location.protocol === "https:",
    });
  } else {
    // Login Google → backend đã set HttpOnly cookie
    setToken("session");
  }
};

const logout = () => {
  setUser(null);
  setToken(null);
  Cookies.remove("token");
};
  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};